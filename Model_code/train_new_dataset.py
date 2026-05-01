"""
Coconut Disease Detector - Production Retrain (MobileNetV3-Large)
=================================================================
- Uses ./dataset  (11-class, ~10,940 images, nested subfolder structure)
- Auto 80/20 train/val split
- CUDA -> MPS -> CPU device selection
- 30 epochs - full fine-tune for maximum accuracy
- Saves best model to mobilenet_new.pth (does NOT touch mobilenet_best.pth)
- Normalises class names: CCI_Caterpillars -> Caterpillars, spaces -> underscores
- Logs every epoch to training_log.txt
"""

import json
import os
import time

import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

# --- Config -------------------------------------------------------------------
DATA_DIR    = os.path.join(os.path.dirname(__file__), "..", "dataset")
SAVE_PATH   = os.path.join(os.path.dirname(__file__), "..", "mobilenet_new.pth")
LOG_PATH    = os.path.join(os.path.dirname(__file__), "..", "training_log.txt")
BATCH_SIZE  = 32
EPOCHS      = 30
LR          = 1e-4
VAL_SPLIT   = 0.2
SEED        = 42

# Class-name normalisation map (folder name -> inference-compatible name)
CLASS_REMAP = {
    "CCI_Caterpillars": "Caterpillars",
    "Bud Root Dropping": "Bud_Root_Dropping",
    "Bud Rot":           "Bud_Rot",
    "Gray Leaf Spot":    "Gray_Leaf_Spot",
    "Leaf Rot":          "Leaf_Rot",
    "Stem Bleeding":     "Stem_Bleeding",
}

# --- Device -------------------------------------------------------------------
if torch.cuda.is_available():
    device = torch.device("cuda")
elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print(f"[INFO] Using device: {device}")

# --- Transforms ---------------------------------------------------------------
train_tfms = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

val_tfms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# --- Dataset ------------------------------------------------------------------
full_ds = datasets.ImageFolder(DATA_DIR)
raw_classes = full_ds.classes
class_names = [CLASS_REMAP.get(c, c) for c in raw_classes]

print(f"[INFO] Dataset folder   : {os.path.abspath(DATA_DIR)}")
print(f"[INFO] Total images     : {len(full_ds)}")

# 80/20 split
n_val   = int(len(full_ds) * VAL_SPLIT)
n_train = len(full_ds) - n_val
torch.manual_seed(SEED)
train_subset, val_subset = random_split(full_ds, [n_train, n_val])

# Apply separate transforms via wrapper
class _SubsetWithTransform(torch.utils.data.Dataset):
    def __init__(self, subset, transform):
        self.subset    = subset
        self.transform = transform
    def __len__(self):
        return len(self.subset)
    def __getitem__(self, idx):
        img, label = self.subset[idx]
        if self.transform:
            img = self.transform(img)
        return img, label

train_ds = _SubsetWithTransform(train_subset, train_tfms)
val_ds   = _SubsetWithTransform(val_subset,   val_tfms)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True,  num_workers=0, pin_memory=(device.type == "cuda"))
val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False, num_workers=0, pin_memory=(device.type == "cuda"))

print(f"[INFO] Train: {n_train} | Val: {n_val}")

# --- Model --------------------------------------------------------------------
try:
    weights = models.MobileNet_V3_Large_Weights.IMAGENET1K_V1
    model   = models.mobilenet_v3_large(weights=weights)
except Exception:
    model   = models.mobilenet_v3_large(weights="IMAGENET1K_V1")

model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(class_names))
model.to(device)

# --- Training setup -----------------------------------------------------------
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LR)

best_acc  = 0.0
log_lines = [f"Training started | device={device} | epochs={EPOCHS} | batch={BATCH_SIZE} | lr={LR}\n"]

# --- Training loop ------------------------------------------------------------
for epoch in range(EPOCHS):
    t0 = time.time()
    model.train()
    train_loss, correct, total = 0.0, 0, 0

    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        out  = model(x)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()

        train_loss += loss.item() * x.size(0)
        _, preds    = torch.max(out, 1)
        correct    += (preds == y).sum().item()
        total      += y.size(0)

    avg_loss  = train_loss / total
    train_acc = correct / total

    # -- Validation ------------------------------------------------------------
    model.eval()
    val_correct, val_total = 0, 0
    with torch.no_grad():
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            out  = model(x)
            _, preds    = torch.max(out, 1)
            val_correct += (preds == y).sum().item()
            val_total   += y.size(0)

    val_acc = val_correct / val_total
    elapsed = time.time() - t0

    line = (f"Epoch {epoch+1:02d}/{EPOCHS} | "
            f"Loss: {avg_loss:.4f} | "
            f"Train Acc: {train_acc:.3f} | "
            f"Val Acc: {val_acc:.3f} | "
            f"Time: {elapsed:.1f}s")
    print(line)
    log_lines.append(line + "\n")

    # -- Save best -------------------------------------------------------------
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(
            {"state_dict": model.state_dict(), "classes": class_names},
            SAVE_PATH
        )
        print(f"  [SAVED] New best -> mobilenet_new.pth  (val_acc={val_acc:.3f})")
        log_lines.append(f"  [SAVED] Best model saved (val_acc={val_acc:.4f})\n")

# --- Finalise -----------------------------------------------------------------
summary = f"\nTraining complete | Best Val Acc: {best_acc:.4f}\n"
summary += f"Classes saved in checkpoint: {class_names}\n"
summary += f"Model saved to: {os.path.abspath(SAVE_PATH)}\n"
print(summary)
log_lines.append(summary)

with open(LOG_PATH, "w", encoding="utf-8") as f:
    f.writelines(log_lines)

print(f"[INFO] Log saved -> {os.path.abspath(LOG_PATH)}")
