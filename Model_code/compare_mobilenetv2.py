"""
Comparison Script: MobileNetV2 - 2 Epochs
==========================================
Dataset  : ../dataset  (11-class, nested structure)
Model    : MobileNetV2 (ImageNet pretrained)
Epochs   : 2
Output   : training/results/mobilenetv2_2epochs.pth
           training/results/mobilenetv2_comparison.txt
"""

import json, os, time
import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

# -- Config --------------------------------------------------------------------
MODEL_NAME  = "MobileNetV2"
DATA_DIR    = os.path.join(os.path.dirname(__file__), "..", "dataset")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")
SAVE_PATH   = os.path.join(RESULTS_DIR, "mobilenetv2_2epochs.pth")
LOG_PATH    = os.path.join(RESULTS_DIR, "mobilenetv2_comparison.txt")
BATCH_SIZE  = 32
EPOCHS      = 2
LR          = 1e-4
VAL_SPLIT   = 0.2
SEED        = 42

CLASS_REMAP = {
    "CCI_Caterpillars":  "Caterpillars",
    "Bud Root Dropping": "Bud_Root_Dropping",
    "Bud Rot":           "Bud_Rot",
    "Gray Leaf Spot":    "Gray_Leaf_Spot",
    "Leaf Rot":          "Leaf_Rot",
    "Stem Bleeding":     "Stem_Bleeding",
}

os.makedirs(RESULTS_DIR, exist_ok=True)

# -- Device --------------------------------------------------------------------
if torch.cuda.is_available():
    device = torch.device("cuda")
elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")
print(f"[{MODEL_NAME}] Device: {device}")

# -- Transforms ----------------------------------------------------------------
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

# -- Dataset -------------------------------------------------------------------
full_ds     = datasets.ImageFolder(DATA_DIR)
raw_classes = full_ds.classes
class_names = [CLASS_REMAP.get(c, c) for c in raw_classes]
num_classes = len(class_names)

print(f"[{MODEL_NAME}] Classes ({num_classes}): {class_names}")
print(f"[{MODEL_NAME}] Total images: {len(full_ds)}")

n_val   = int(len(full_ds) * VAL_SPLIT)
n_train = len(full_ds) - n_val
torch.manual_seed(SEED)
train_sub, val_sub = random_split(full_ds, [n_train, n_val])

class _SubsetTransform(torch.utils.data.Dataset):
    def __init__(self, subset, tfm): self.subset, self.tfm = subset, tfm
    def __len__(self): return len(self.subset)
    def __getitem__(self, i):
        img, lbl = self.subset[i]
        return self.tfm(img), lbl

train_ds = _SubsetTransform(train_sub, train_tfms)
val_ds   = _SubsetTransform(val_sub,   val_tfms)
train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True,  num_workers=0, pin_memory=(device.type=="cuda"))
val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False, num_workers=0, pin_memory=(device.type=="cuda"))
print(f"[{MODEL_NAME}] Train: {n_train} | Val: {n_val}")

# -- Model ---------------------------------------------------------------------
try:
    weights = models.MobileNet_V2_Weights.IMAGENET1K_V1
    model   = models.mobilenet_v2(weights=weights)
except Exception:
    model   = models.mobilenet_v2(pretrained=True)

model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LR)

# -- Training loop -------------------------------------------------------------
best_acc  = 0.0
log_lines = [f"Model: {MODEL_NAME} | Device: {device} | Epochs: {EPOCHS} | Batch: {BATCH_SIZE} | LR: {LR}\n",
             f"Classes: {class_names}\n",
             f"Train: {n_train} | Val: {n_val}\n\n"]

for epoch in range(EPOCHS):
    t0 = time.time()
    model.train()
    train_loss, correct, total = 0.0, 0, 0

    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        out  = model(x)
        loss = criterion(out, y)
        loss.backward(); optimizer.step()
        train_loss += loss.item() * x.size(0)
        _, p = torch.max(out, 1)
        correct += (p == y).sum().item(); total += y.size(0)

    avg_loss  = train_loss / total
    train_acc = correct / total

    model.eval(); vc, vt = 0, 0
    with torch.no_grad():
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            _, p = torch.max(model(x), 1)
            vc += (p == y).sum().item(); vt += y.size(0)
    val_acc = vc / vt
    elapsed = time.time() - t0

    line = (f"Epoch {epoch+1:02d}/{EPOCHS} | Loss: {avg_loss:.4f} | "
            f"Train Acc: {train_acc:.4f} | Val Acc: {val_acc:.4f} | Time: {elapsed:.1f}s")
    print(line)
    log_lines.append(line + "\n")

    if val_acc > best_acc:
        best_acc = val_acc
        torch.save({"state_dict": model.state_dict(), "classes": class_names,
                    "model_name": MODEL_NAME, "val_acc": val_acc}, SAVE_PATH)
        print(f"  [SAVED] Best -> {os.path.basename(SAVE_PATH)}  (val_acc={val_acc:.4f})")
        log_lines.append(f"  [SAVED] Best val_acc={val_acc:.4f}\n")

summary = (f"\n{'='*60}\n"
           f"SUMMARY: {MODEL_NAME}\n"
           f"Best Val Acc : {best_acc:.4f} ({best_acc*100:.2f}%)\n"
           f"Classes      : {num_classes}\n"
           f"Epochs run   : {EPOCHS}\n"
           f"Dataset size : {len(full_ds)} images\n"
           f"Saved to     : {SAVE_PATH}\n"
           f"{'='*60}\n")
print(summary)
log_lines.append(summary)

with open(LOG_PATH, "w", encoding="utf-8") as f:
    f.writelines(log_lines)
print(f"[{MODEL_NAME}] Log -> {LOG_PATH}")
