"""
Comparison Script: DenseNet-121 - 2 Epochs
Dataset  : ../dataset  (11-class)
Model    : DenseNet-121 (ImageNet pretrained)
Output   : training/results/densenet121_2epochs.pth + densenet121_comparison.txt
"""
import os, time
import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

MODEL_NAME  = "DenseNet-121"
DATA_DIR    = os.path.join(os.path.dirname(__file__), "..", "dataset")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")
SAVE_PATH   = os.path.join(RESULTS_DIR, "densenet121_2epochs.pth")
LOG_PATH    = os.path.join(RESULTS_DIR, "densenet121_comparison.txt")
BATCH_SIZE, EPOCHS, LR, VAL_SPLIT, SEED = 32, 2, 1e-4, 0.2, 42

CLASS_REMAP = {
    "CCI_Caterpillars": "Caterpillars", "Bud Root Dropping": "Bud_Root_Dropping",
    "Bud Rot": "Bud_Rot", "Gray Leaf Spot": "Gray_Leaf_Spot",
    "Leaf Rot": "Leaf_Rot", "Stem Bleeding": "Stem_Bleeding",
}
os.makedirs(RESULTS_DIR, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "mps" if getattr(torch.backends,"mps",None) and torch.backends.mps.is_available() else "cpu")
print(f"[{MODEL_NAME}] Device: {device}")

train_tfms = transforms.Compose([transforms.RandomResizedCrop(224), transforms.RandomHorizontalFlip(), transforms.ColorJitter(0.2,0.2,0.2), transforms.ToTensor(), transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])])
val_tfms   = transforms.Compose([transforms.Resize(256), transforms.CenterCrop(224), transforms.ToTensor(), transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])])

full_ds = datasets.ImageFolder(DATA_DIR)
class_names = [CLASS_REMAP.get(c,c) for c in full_ds.classes]
num_classes = len(class_names)
print(f"[{MODEL_NAME}] Classes ({num_classes}): {class_names} | Total: {len(full_ds)}")

n_val = int(len(full_ds)*VAL_SPLIT); n_train = len(full_ds)-n_val
torch.manual_seed(SEED)
train_sub, val_sub = random_split(full_ds, [n_train, n_val])

class _ST(torch.utils.data.Dataset):
    def __init__(self,s,t): self.s,self.t=s,t
    def __len__(self): return len(self.s)
    def __getitem__(self,i): img,lbl=self.s[i]; return self.t(img),lbl

train_loader = DataLoader(_ST(train_sub,train_tfms), batch_size=BATCH_SIZE, shuffle=True,  num_workers=0, pin_memory=(device.type=="cuda"))
val_loader   = DataLoader(_ST(val_sub,  val_tfms),   batch_size=BATCH_SIZE, shuffle=False, num_workers=0, pin_memory=(device.type=="cuda"))
print(f"[{MODEL_NAME}] Train: {n_train} | Val: {n_val}")

try:    model = models.densenet121(weights=models.DenseNet121_Weights.IMAGENET1K_V1)
except: model = models.densenet121(pretrained=True)
model.classifier = nn.Linear(model.classifier.in_features, num_classes)
model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LR)
best_acc  = 0.0
log_lines = [f"Model: {MODEL_NAME} | Device: {device} | Epochs: {EPOCHS} | Batch: {BATCH_SIZE}\nClasses: {class_names}\nTrain: {n_train} | Val: {n_val}\n\n"]

for epoch in range(EPOCHS):
    t0=time.time(); model.train(); tl,c,tot=0.0,0,0
    for x,y in train_loader:
        x,y=x.to(device),y.to(device); optimizer.zero_grad()
        out=model(x); loss=criterion(out,y); loss.backward(); optimizer.step()
        tl+=loss.item()*x.size(0); _,p=torch.max(out,1); c+=(p==y).sum().item(); tot+=y.size(0)
    train_acc=c/tot
    model.eval(); vc,vt=0,0
    with torch.no_grad():
        for x,y in val_loader:
            x,y=x.to(device),y.to(device); _,p=torch.max(model(x),1); vc+=(p==y).sum().item(); vt+=y.size(0)
    val_acc=vc/vt; elapsed=time.time()-t0
    line=f"Epoch {epoch+1:02d}/{EPOCHS} | Loss: {tl/tot:.4f} | Train Acc: {train_acc:.4f} | Val Acc: {val_acc:.4f} | Time: {elapsed:.1f}s"
    print(line); log_lines.append(line+"\n")
    if val_acc>best_acc:
        best_acc=val_acc
        torch.save({"state_dict":model.state_dict(),"classes":class_names,"model_name":MODEL_NAME,"val_acc":val_acc},SAVE_PATH)
        print(f"  [SAVED] val_acc={val_acc:.4f}"); log_lines.append(f"  [SAVED] val_acc={val_acc:.4f}\n")

summary=f"\n{'='*60}\nSUMMARY: {MODEL_NAME}\nBest Val Acc : {best_acc:.4f} ({best_acc*100:.2f}%)\nClasses: {num_classes} | Epochs: {EPOCHS} | Dataset: {len(full_ds)}\nSaved -> {SAVE_PATH}\n{'='*60}\n"
print(summary); log_lines.append(summary)
with open(LOG_PATH,"w",encoding="utf-8") as f: f.writelines(log_lines)
print(f"[{MODEL_NAME}] Log -> {LOG_PATH}")
