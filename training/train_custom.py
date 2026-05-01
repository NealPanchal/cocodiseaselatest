"""
Coconut Leaf Disease Detection — Training Pipeline v2
=====================================================
Fixes data leakage, adds proper evaluation, confusion matrix, and regularisation.

Changes from v1:
  - Deduplicate images (MD5 hash) before splitting
  - Stratified 70/15/15 train/val/test split (no cross-split leakage)
  - Weighted CrossEntropyLoss for class imbalance
  - Dropout 0.4 on classifier, weight decay 1e-4
  - Early stopping (patience=7) + ReduceLROnPlateau
  - Train vs val loss logged every epoch (overfitting check)
  - Post-training test evaluation: accuracy, precision, recall, F1
  - Confusion matrix saved as confusion_matrix.png
"""

import collections
import hashlib
import json
import os
import time

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend (no GUI needed)
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import torch
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from torch import nn, optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image

# ─── Config ───────────────────────────────────────────────────────────────────
DATASET_ROOT = "/Users/neal/Desktop/LATEST COO/coconut_dataset"
SAVE_PATH    = os.path.join(os.path.dirname(__file__), "..", "mobilenet_new.pth")
LOG_PATH     = os.path.join(os.path.dirname(__file__), "..", "training_log_custom.txt")
CLASS_MAP_PATH = os.path.join(os.path.dirname(__file__), "..", "class_map.json")
CONFUSION_MATRIX_PATH = os.path.join(os.path.dirname(__file__), "..", "confusion_matrix.png")

BATCH_SIZE   = 32
EPOCHS       = 20
LR           = 1e-4
WEIGHT_DECAY = 1e-4
DROPOUT      = 0.4
PATIENCE     = 7        # Early stopping patience
SEED         = 42

TRAIN_RATIO  = 0.70
VAL_RATIO    = 0.15
TEST_RATIO   = 0.15

# ─── Device ───────────────────────────────────────────────────────────────────
if torch.cuda.is_available():
    device = torch.device("cuda")
elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print(f"[INFO] Using device: {device}")

# ─── Transforms ───────────────────────────────────────────────────────────────
# Train: aggressive augmentation
train_tfms = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(p=0.3),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.1),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# Val / Test: deterministic (no augmentation)
eval_tfms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


# ═════════════════════════════════════════════════════════════════════════════
# PART 1 — DEDUPLICATION + STRATIFIED SPLIT
# ═════════════════════════════════════════════════════════════════════════════

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}

# Normalise variant folder names to the canonical 11 classes.
# The root-level folder "CCI_Caterpillars" is the same disease as "Caterpillars".
CLASS_NAME_MAP = {
    "CCI_Caterpillars": "Caterpillars",
}


def hash_file(path: str) -> str:
    """MD5 hash of file content."""
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_and_deduplicate(root: str) -> tuple:
    """
    Walk all sub-directories of `root` (including train/, val/, and any
    loose class folders) to collect every image, then deduplicate by MD5.

    Returns:
        paths  — list of unique image paths
        labels — list of corresponding class names
        stats  — dict with dedup statistics
    """
    # Collect all images → (path, class_name)
    all_images = []
    for dirpath, _dirs, files in os.walk(root):
        # Determine class name: immediate parent folder
        class_name = os.path.basename(dirpath)
        # Skip the root itself and the split dirs (train/, val/) as class names
        if class_name in ("train", "val", "test", os.path.basename(root)):
            continue
        # Normalise class name via map
        class_name = CLASS_NAME_MAP.get(class_name, class_name)
        for fname in files:
            if os.path.splitext(fname)[1].lower() in IMAGE_EXTS:
                all_images.append((os.path.join(dirpath, fname), class_name))

    print(f"[DEDUP] Total files found: {len(all_images)}")

    # Hash and deduplicate
    seen_hashes = {}
    unique_paths = []
    unique_labels = []
    dup_count = 0

    for path, class_name in all_images:
        h = hash_file(path)
        if h not in seen_hashes:
            seen_hashes[h] = path
            unique_paths.append(path)
            unique_labels.append(class_name)
        else:
            dup_count += 1

    stats = {
        "total_files": len(all_images),
        "unique_images": len(unique_paths),
        "duplicates_removed": dup_count,
    }
    print(f"[DEDUP] Unique images: {stats['unique_images']}")
    print(f"[DEDUP] Duplicates removed: {stats['duplicates_removed']}")

    return unique_paths, unique_labels, stats


# Collect and deduplicate
all_paths, all_labels, dedup_stats = collect_and_deduplicate(DATASET_ROOT)

# Discover class names (sorted for deterministic indexing)
class_names = sorted(set(all_labels))
num_classes = len(class_names)
class_to_idx = {c: i for i, c in enumerate(class_names)}
all_indices = [class_to_idx[l] for l in all_labels]

print(f"[INFO] Detected classes ({num_classes}): {class_names}")

# Per-class counts
class_counts = collections.Counter(all_labels)
print("[INFO] Per-class unique image counts:")
for c in class_names:
    print(f"  {c}: {class_counts[c]}")

# Save class mapping
class_map = {str(i): name for i, name in enumerate(class_names)}
class_map_abs = os.path.abspath(CLASS_MAP_PATH)
with open(class_map_abs, "w", encoding="utf-8") as f:
    json.dump(class_map, f, indent=2, ensure_ascii=False)
print(f"[INFO] Class map saved: {class_map_abs}")

# Stratified split: 70% train, 15% val, 15% test
# First split: train vs (val+test)
train_paths, temp_paths, train_labels, temp_labels = train_test_split(
    all_paths, all_indices,
    test_size=(VAL_RATIO + TEST_RATIO),
    stratify=all_indices,
    random_state=SEED,
)

# Second split: val vs test (50/50 of the remaining 30%)
val_paths, test_paths, val_labels, test_labels = train_test_split(
    temp_paths, temp_labels,
    test_size=(TEST_RATIO / (VAL_RATIO + TEST_RATIO)),
    stratify=temp_labels,
    random_state=SEED,
)

print(f"\n[INFO] Split sizes — Train: {len(train_paths)} | Val: {len(val_paths)} | Test: {len(test_paths)}")
print(f"[INFO] Total: {len(train_paths) + len(val_paths) + len(test_paths)} (should equal {len(all_paths)})")


# ─── Custom Dataset ───────────────────────────────────────────────────────────
class LeafDataset(Dataset):
    """Simple dataset from (path, label) pairs with a transform."""
    def __init__(self, paths, labels, transform=None):
        self.paths = paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        img = Image.open(self.paths[idx]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, self.labels[idx]


train_ds = LeafDataset(train_paths, train_labels, train_tfms)
val_ds   = LeafDataset(val_paths,   val_labels,   eval_tfms)
test_ds  = LeafDataset(test_paths,  test_labels,  eval_tfms)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True,  num_workers=0)
val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
test_loader  = DataLoader(test_ds,  batch_size=BATCH_SIZE, shuffle=False, num_workers=0)


# ═════════════════════════════════════════════════════════════════════════════
# PART 5 — MODEL WITH REGULARISATION
# ═════════════════════════════════════════════════════════════════════════════

try:
    weights = models.MobileNet_V3_Large_Weights.IMAGENET1K_V1
    model = models.mobilenet_v3_large(weights=weights)
except Exception:
    model = models.mobilenet_v3_large(pretrained=True)

# Replace classifier with dropout
# MobileNetV3 classifier: [0] Linear, [1] Hardswish, [2] Dropout, [3] Linear
model.classifier[2] = nn.Dropout(p=DROPOUT)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, num_classes)
model.to(device)

print(f"\n[INFO] Model: MobileNetV3-Large | Dropout: {DROPOUT} | Weight Decay: {WEIGHT_DECAY}")

# ─── Weighted loss for class imbalance ────────────────────────────────────────
train_label_counts = collections.Counter(train_labels)
total_train = len(train_labels)
class_weights = []
for i in range(num_classes):
    count = train_label_counts.get(i, 1)
    w = total_train / (num_classes * count)
    class_weights.append(w)

class_weights_tensor = torch.FloatTensor(class_weights).to(device)
print(f"[INFO] Class weights: {[f'{w:.2f}' for w in class_weights]}")

criterion = nn.CrossEntropyLoss(weight=class_weights_tensor)
optimizer = optim.AdamW(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
scheduler = ReduceLROnPlateau(optimizer, mode="min", factor=0.5, patience=3)


# ═════════════════════════════════════════════════════════════════════════════
# TRAINING LOOP — with val loss, early stopping, overfitting tracking
# ═════════════════════════════════════════════════════════════════════════════

best_val_loss = float("inf")
best_val_acc  = 0.0
patience_counter = 0
log_lines = []

header = (
    f"Training started | device={device} | epochs={EPOCHS} | batch={BATCH_SIZE} | "
    f"lr={LR} | weight_decay={WEIGHT_DECAY} | dropout={DROPOUT} | classes={num_classes}\n"
)
log_lines.append(header)
log_lines.append(f"Classes: {class_names}\n")
log_lines.append(f"Train: {len(train_paths)} | Val: {len(val_paths)} | Test: {len(test_paths)}\n")
log_lines.append(f"Dedup: {dedup_stats['duplicates_removed']} duplicates removed from {dedup_stats['total_files']} files\n\n")
print(header)

# Track loss history for overfitting analysis
train_loss_history = []
val_loss_history = []

for epoch in range(EPOCHS):
    t0 = time.time()

    # ── Train ─────────────────────────────────────────────────────────────────
    model.train()
    train_loss, correct, total = 0.0, 0, 0

    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        out = model(x)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()

        train_loss += loss.item() * x.size(0)
        _, preds = torch.max(out, 1)
        correct += (preds == y).sum().item()
        total += y.size(0)

    avg_train_loss = train_loss / total
    train_acc = correct / total

    # ── Validation ────────────────────────────────────────────────────────────
    model.eval()
    val_loss, val_correct, val_total = 0.0, 0, 0
    with torch.no_grad():
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            out = model(x)
            loss = criterion(out, y)
            val_loss += loss.item() * x.size(0)
            _, preds = torch.max(out, 1)
            val_correct += (preds == y).sum().item()
            val_total += y.size(0)

    avg_val_loss = val_loss / val_total
    val_acc = val_correct / val_total
    elapsed = time.time() - t0

    # Track history
    train_loss_history.append(avg_train_loss)
    val_loss_history.append(avg_val_loss)

    # Step scheduler
    scheduler.step(avg_val_loss)
    current_lr = optimizer.param_groups[0]["lr"]

    line = (
        f"Epoch {epoch+1:02d}/{EPOCHS} | "
        f"Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | "
        f"Train Acc: {train_acc:.3f} | Val Acc: {val_acc:.3f} | "
        f"LR: {current_lr:.1e} | Time: {elapsed:.1f}s"
    )
    print(line)
    log_lines.append(line + "\n")

    # ── Save best (by val loss) ───────────────────────────────────────────────
    if avg_val_loss < best_val_loss:
        best_val_loss = avg_val_loss
        best_val_acc = val_acc
        patience_counter = 0
        torch.save(
            {"state_dict": model.state_dict(), "classes": class_names},
            SAVE_PATH,
        )
        save_msg = f"  [SAVED] New best → mobilenet_new.pth (val_loss={avg_val_loss:.4f}, val_acc={val_acc:.3f})"
        print(save_msg)
        log_lines.append(save_msg + "\n")
    else:
        patience_counter += 1
        if patience_counter >= PATIENCE:
            stop_msg = f"\n[EARLY STOP] No improvement for {PATIENCE} epochs.\n"
            print(stop_msg)
            log_lines.append(stop_msg)
            break


# ═════════════════════════════════════════════════════════════════════════════
# PART 4 — OVERFITTING CHECK
# ═════════════════════════════════════════════════════════════════════════════

print("\n" + "=" * 60)
print("OVERFITTING ANALYSIS")
print("=" * 60)

final_train_loss = train_loss_history[-1]
final_val_loss = val_loss_history[-1]
gap = final_val_loss - final_train_loss

overfit_msg = []
overfit_msg.append(f"Final Train Loss: {final_train_loss:.4f}")
overfit_msg.append(f"Final Val Loss:   {final_val_loss:.4f}")
overfit_msg.append(f"Gap (val - train): {gap:.4f}")

if abs(gap) < 0.05:
    overfit_msg.append("→ Good: Train and val losses are close — model generalises well.")
elif gap > 0.3:
    overfit_msg.append("→ WARNING: Val loss is much higher than train loss — possible overfitting!")
elif gap < -0.1:
    overfit_msg.append("→ NOTE: Val loss lower than train loss — expected with augmentation on train.")
else:
    overfit_msg.append("→ Mild gap — monitor over longer training.")

for m in overfit_msg:
    print(m)
    log_lines.append(m + "\n")


# ═════════════════════════════════════════════════════════════════════════════
# PART 2 + 3 — TEST SET EVALUATION + CONFUSION MATRIX
# ═════════════════════════════════════════════════════════════════════════════

print("\n" + "=" * 60)
print("TEST SET EVALUATION (unseen data)")
print("=" * 60)

# Load best model for test evaluation
ckpt = torch.load(SAVE_PATH, map_location=device)
model.load_state_dict(ckpt["state_dict"])
model.eval()

all_preds = []
all_true = []

with torch.no_grad():
    for x, y in test_loader:
        x, y = x.to(device), y.to(device)
        out = model(x)
        _, preds = torch.max(out, 1)
        all_preds.extend(preds.cpu().numpy())
        all_true.extend(y.cpu().numpy())

all_preds = np.array(all_preds)
all_true = np.array(all_true)

# Overall accuracy
test_acc = (all_preds == all_true).sum() / len(all_true)
test_precision = precision_score(all_true, all_preds, average="macro", zero_division=0)
test_recall = recall_score(all_true, all_preds, average="macro", zero_division=0)
test_f1 = f1_score(all_true, all_preds, average="macro", zero_division=0)

test_metrics = [
    f"Test Accuracy:  {test_acc:.4f} ({test_acc*100:.1f}%)",
    f"Test Precision: {test_precision:.4f} (macro)",
    f"Test Recall:    {test_recall:.4f} (macro)",
    f"Test F1-Score:  {test_f1:.4f} (macro)",
]

for m in test_metrics:
    print(m)
    log_lines.append(m + "\n")

# Per-class report
print("\n--- Per-Class Classification Report ---")
report = classification_report(all_true, all_preds, target_names=class_names, zero_division=0)
print(report)
log_lines.append("\n--- Per-Class Classification Report ---\n")
log_lines.append(report + "\n")

# Per-class accuracy
print("--- Per-Class Accuracy ---")
log_lines.append("--- Per-Class Accuracy ---\n")
for i, cls in enumerate(class_names):
    mask = all_true == i
    if mask.sum() > 0:
        cls_acc = (all_preds[mask] == i).sum() / mask.sum()
        line = f"  {cls}: {cls_acc:.3f} ({cls_acc*100:.1f}%) — {int(mask.sum())} samples"
    else:
        line = f"  {cls}: N/A — 0 test samples"
    print(line)
    log_lines.append(line + "\n")


# ── Confusion Matrix ──────────────────────────────────────────────────────────

cm = confusion_matrix(all_true, all_preds)
plt.figure(figsize=(14, 11))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=class_names,
    yticklabels=class_names,
    linewidths=0.5,
    linecolor="gray",
)
plt.xlabel("Predicted", fontsize=13)
plt.ylabel("True", fontsize=13)
plt.title(f"Coconut Disease Detection — Confusion Matrix\n(Test Set: {len(all_true)} samples | Accuracy: {test_acc*100:.1f}%)", fontsize=14)
plt.xticks(rotation=45, ha="right", fontsize=9)
plt.yticks(rotation=0, fontsize=9)
plt.tight_layout()

cm_path = os.path.abspath(CONFUSION_MATRIX_PATH)
plt.savefig(cm_path, dpi=150)
plt.close()
print(f"\n[INFO] Confusion matrix saved → {cm_path}")
log_lines.append(f"\n[INFO] Confusion matrix saved → {cm_path}\n")


# ═════════════════════════════════════════════════════════════════════════════
# FINALISE
# ═════════════════════════════════════════════════════════════════════════════

summary = f"""
{'='*60}
TRAINING COMPLETE
{'='*60}
Best Val Loss: {best_val_loss:.4f}
Best Val Acc:  {best_val_acc:.4f}
Test Accuracy: {test_acc:.4f}
Test F1 Score: {test_f1:.4f}
Classes ({num_classes}): {class_names}
Class map: {class_map_abs}
Model saved to: {os.path.abspath(SAVE_PATH)}
Confusion matrix: {cm_path}
"""

print(summary)
log_lines.append(summary)

with open(LOG_PATH, "w", encoding="utf-8") as f:
    f.writelines(log_lines)

log_path_abs = os.path.abspath(LOG_PATH)
print(f"[INFO] Log saved → {log_path_abs}")
