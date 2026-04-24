"""
switch_model.py — Safe model switch / rollback utility
=======================================================
Usage:
  python switch_model.py --validate    # Quick inference check on new model
  python switch_model.py --switch      # Deploy new model (replaces mobilenet_best.pth)
  python switch_model.py --rollback    # Restore old model from mobilenet_old.pth
  python switch_model.py --status      # Show which model files exist
"""

import argparse
import os
import shutil
import sys

import torch
from PIL import Image
from torchvision import models, transforms
from torch import nn

ROOT = os.path.dirname(os.path.abspath(__file__))

BEST_PATH    = os.path.join(ROOT, "mobilenet_best.pth")
NEW_PATH     = os.path.join(ROOT, "mobilenet_new.pth")
OLD_PATH     = os.path.join(ROOT, "mobilenet_old.pth")
BACKUP_PATH  = os.path.join(ROOT, "mobilenet_best_backup.pth")

# ─── Helpers ──────────────────────────────────────────────────────────────────

def file_info(path):
    if os.path.exists(path):
        mb = os.path.getsize(path) / 1024 / 1024
        return f"EXISTS  ({mb:.1f} MB)"
    return "MISSING"


def status():
    print("\n-- Model file status ----------------------------------")
    print(f"  mobilenet_best.pth        : {file_info(BEST_PATH)}")
    print(f"  mobilenet_new.pth         : {file_info(NEW_PATH)}")
    print(f"  mobilenet_old.pth         : {file_info(OLD_PATH)}")
    print(f"  mobilenet_best_backup.pth : {file_info(BACKUP_PATH)}")
    print("-------------------------------------------------------\n")


def load_model(path):
    """Load a checkpoint and return (model, classes)."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model not found: {path}")

    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")

    ckpt = torch.load(path, map_location=device)
    if isinstance(ckpt, dict) and "classes" in ckpt:
        classes = ckpt["classes"]
    else:
        classes = ["Caterpillars", "CCI_Leaflets", "Healthy_Leaves",
                   "WCLWD_DryingofLeaflets", "WCLWD_Flaccidity", "WCLWD_Yellowing"]

    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(classes))
    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        model.load_state_dict(ckpt["state_dict"])
    else:
        model.load_state_dict(ckpt)
    model.to(device)
    model.eval()
    return model, classes, device


def validate():
    """Quick sanity-check: load both models and run one inference pass."""
    tfm = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

    # Find a sample image
    dataset_dir = os.path.join(ROOT, "dataset")
    sample_img  = None
    for root, dirs, files in os.walk(dataset_dir):
        for f in files:
            if f.lower().endswith((".jpg", ".jpeg", ".png")):
                sample_img = os.path.join(root, f)
                break
        if sample_img:
            break

    if not sample_img:
        print("[WARN] No sample image found in ./dataset — skipping inference check")
        return

    print(f"[INFO] Sample image: {sample_img}")
    img = Image.open(sample_img).convert("RGB")
    x   = tfm(img).unsqueeze(0)

    for label, path in [("OLD (mobilenet_best.pth)", BEST_PATH),
                         ("NEW (mobilenet_new.pth)", NEW_PATH)]:
        if not os.path.exists(path):
            print(f"  [{label}] File missing — skipping")
            continue
        try:
            model, classes, device = load_model(path)
            with torch.no_grad():
                out  = model(x.to(device))
                prob = torch.softmax(out, 1)
                conf, pred = torch.max(prob, 1)
            print(f"  [{label}]  → {classes[pred.item()]}  ({conf.item()*100:.1f}%)  | classes: {classes}")
        except Exception as e:
            print(f"  [{label}]  ERROR: {e}")


def switch():
    """Deploy new model: best→old, new→best."""
    if not os.path.exists(NEW_PATH):
        print("[ERROR] mobilenet_new.pth not found. Run training first.")
        sys.exit(1)

    # Step 1: archive current best
    if os.path.exists(BEST_PATH):
        shutil.copy2(BEST_PATH, OLD_PATH)
        print(f"[OK] mobilenet_best.pth  ->  mobilenet_old.pth  (archived)")

    # Step 2: promote new model
    shutil.copy2(NEW_PATH, BEST_PATH)
    print(f"[OK] mobilenet_new.pth   ->  mobilenet_best.pth  (promoted)")
    print("\n✓ Switch complete. Restart the FastAPI server to load the new model.")
    print("  Rollback available: python switch_model.py --rollback")


def rollback():
    """Restore from mobilenet_old.pth."""
    if not os.path.exists(OLD_PATH):
        # Try backup
        if os.path.exists(BACKUP_PATH):
            shutil.copy2(BACKUP_PATH, BEST_PATH)
            print(f"[OK] mobilenet_best_backup.pth  ->  mobilenet_best.pth  (restored from backup)")
            return
        print("[ERROR] No rollback source found (mobilenet_old.pth or mobilenet_best_backup.pth).")
        sys.exit(1)

    shutil.copy2(OLD_PATH, BEST_PATH)
    print(f"[OK] mobilenet_old.pth  ->  mobilenet_best.pth  (restored)")
    print("\n✓ Rollback complete. Restart the FastAPI server.")


# ─── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Safe model switch/rollback utility")
    group  = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--validate", action="store_true", help="Test both models on a sample image")
    group.add_argument("--switch",   action="store_true", help="Deploy new model as active model")
    group.add_argument("--rollback", action="store_true", help="Restore previous model")
    group.add_argument("--status",   action="store_true", help="Show model file status")

    args = parser.parse_args()
    status()

    if args.validate:
        validate()
    elif args.switch:
        switch()
    elif args.rollback:
        rollback()
    elif args.status:
        pass  # already printed
