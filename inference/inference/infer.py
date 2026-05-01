import io
import json
import math
import os
import sys
from functools import lru_cache

import numpy as np
import torch
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter, ImageStat
from torchvision import models, transforms

from .disease_reports import REPORTS_EN
from .disease_reports_i18n import REPORTS_I18N

app = FastAPI(title="Coconut Leaf Disease Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== DEVICE =====
def _resolve_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    mps_backend = getattr(torch.backends, "mps", None)
    if mps_backend is not None and mps_backend.is_available():
        return torch.device("mps")
    return torch.device("cpu")


device = _resolve_device()
print(f"[inference] device = {device}")

# ===== CLASS MAP (dynamic — loaded from class_map.json) =====
_script_dir = os.path.dirname(os.path.abspath(__file__))
_repo_root = os.path.abspath(os.path.join(_script_dir, "..", ".."))
_class_map_path = os.path.join(_repo_root, "class_map.json")

# Fallback class names if class_map.json not yet generated
_FALLBACK_CLASSES = [
    "Bud Root Dropping", "Bud Rot", "CCI_Leaflets", "Caterpillars",
    "Gray Leaf Spot", "Healthy_Leaves", "Leaf Rot", "Stem Bleeding",
    "WCLWD_DryingofLeaflets", "WCLWD_Flaccidity", "WCLWD_Yellowing"
]


def _load_class_names() -> list:
    """Load class names from class_map.json, fall back to hardcoded list."""
    if os.path.exists(_class_map_path):
        with open(_class_map_path, "r", encoding="utf-8") as f:
            cmap = json.load(f)
        # Sort by integer key to get ordered list
        return [cmap[str(i)] for i in range(len(cmap))]
    print(f"[inference] WARNING: {_class_map_path} not found, using fallback classes")
    return list(_FALLBACK_CLASSES)


class_names = _load_class_names()
print(f"[inference] classes ({len(class_names)}): {class_names}")


def get_report(disease: str, lang: str) -> dict:
    key = (lang or "en").strip().lower()
    templates = REPORTS_I18N.get(key) or REPORTS_I18N.get("en")
    report = templates.get(disease) if isinstance(templates, dict) else None
    if report is None:
        report = REPORTS_EN.get(disease)
    if report is None:
        return {
            "status": "Unknown",
            "cause": ["No report template available for this label."],
            "symptoms": [],
            "remedies": [],
            "prevention": [],
            "fertilizers": [],
        }
    return report


@lru_cache(maxsize=1)
def _get_model_and_classes():
    num_classes = len(class_names)
    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = torch.nn.Linear(
        model.classifier[3].in_features,
        num_classes,
    )

    model_path = os.path.join(_repo_root, "mobilenet_best.pth")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model weights not found at: {model_path}")

    ckpt = torch.load(model_path, map_location=device)
    classes = list(class_names)
    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        model.load_state_dict(ckpt["state_dict"])
        if isinstance(ckpt.get("classes"), list) and ckpt["classes"]:
            classes = ckpt["classes"]
    else:
        model.load_state_dict(ckpt)

    model.to(device)
    model.eval()
    return model, classes

# ===== TRANSFORMS =====
tfm = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# ===== CONFIDENCE THRESHOLD =====
_CONFIDENCE_THRESHOLD = 0.60

# ===== PLANT / LEAF VALIDATION GATE =====
# Rejects non-plant images (humans, objects, etc.) before disease classification.
# Uses HSV green-channel analysis, edge density, and color distribution.

_LEAF_GREEN_RATIO_MIN = 0.08      # At least 8% of pixels should be in the green/vegetation HSV range
_LEAF_EDGE_DENSITY_MIN = 0.02     # Leaves have fine vein-like edges
_LEAF_EDGE_DENSITY_MAX = 0.55     # But not noisy random patterns
_LEAF_SATURATION_MIN = 25.0       # Leaves are generally not gray/desaturated
_SKIN_RATIO_MAX = 0.35            # Reject if >35% of pixels are skin-toned


def _is_likely_leaf(img: Image.Image) -> tuple:
    """Return (is_leaf: bool, reason: str) using color + texture heuristics."""
    rgb = img.convert("RGB").resize((224, 224))
    arr = np.array(rgb, dtype=np.float32)

    # --- 1. HSV green-vegetation ratio ---
    # Convert RGB [0-255] to HSV manually for speed (avoid OpenCV dependency)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c + 1e-7

    # Hue calculation (0-360 scale)
    hue = np.zeros_like(max_c)
    mask_r = (max_c == r)
    mask_g = (max_c == g)
    mask_b = (max_c == b)
    hue[mask_r] = 60.0 * (((g[mask_r] - b[mask_r]) / delta[mask_r]) % 6)
    hue[mask_g] = 60.0 * (((b[mask_g] - r[mask_g]) / delta[mask_g]) + 2)
    hue[mask_b] = 60.0 * (((r[mask_b] - g[mask_b]) / delta[mask_b]) + 4)

    saturation = np.where(max_c > 0, (delta / max_c) * 100, 0)
    value = (max_c / 255.0) * 100

    # Green/vegetation hue range: 35-160 degrees, with reasonable saturation and brightness
    green_mask = (
        (hue >= 35) & (hue <= 160) &
        (saturation >= 15) &
        (value >= 10)
    )
    green_ratio = np.sum(green_mask) / green_mask.size

    # Brown/dry leaf hue range: 15-45 degrees (brown/olive tones common in diseased leaves)
    brown_mask = (
        (hue >= 10) & (hue <= 50) &
        (saturation >= 10) &
        (value >= 10) & (value <= 80)
    )
    brown_ratio = np.sum(brown_mask) / brown_mask.size

    # Combined vegetation ratio (green + brown/dry leaf tones)
    vegetation_ratio = green_ratio + brown_ratio * 0.6

    # --- 2. Skin-tone detection (to reject human faces/hands) ---
    # Skin in HSV: hue 0-50, sat 15-70%, val 30-100%
    skin_mask = (
        ((hue >= 0) & (hue <= 50)) &
        (saturation >= 15) & (saturation <= 70) &
        (value >= 30)
    )
    # Additional RGB skin check: R > 95, G > 40, B > 20, R > G, R > B
    rgb_skin = (r > 95) & (g > 40) & (b > 20) & (r > g) & (r > b)
    combined_skin = skin_mask & rgb_skin
    skin_ratio = np.sum(combined_skin) / combined_skin.size

    # --- 3. Edge density (leaf vein patterns) ---
    gray = rgb.convert("L")
    edges = gray.filter(ImageFilter.Kernel(
        (3, 3), [-1, -1, -1, -1, 8, -1, -1, -1, -1], scale=1, offset=128
    ))
    edge_arr = np.array(edges, dtype=np.float32)
    edge_pixels = np.sum(np.abs(edge_arr - 128) > 25)
    edge_density = edge_pixels / edge_arr.size

    # --- 4. Average saturation check (leaves are colorful, not gray) ---
    avg_saturation = np.mean(saturation)

    # --- Decision logic ---
    # Reject if significant skin tone detected
    if skin_ratio > _SKIN_RATIO_MAX:
        # Only allow if there's also strong green vegetation (e.g., hand holding a leaf)
        if green_ratio < 0.20:
            return False, "skin_detected"

    # Accept if good vegetation ratio (must not be dominantly skin)
    if vegetation_ratio >= _LEAF_GREEN_RATIO_MIN:
        # But reject if it's mostly skin with overlapping brown tones
        if skin_ratio > 0.50 and green_ratio < 0.10:
            return False, "skin_detected"
        return True, "ok"

    # Accept if edge density is in leaf-like range AND some color AND not skin
    if (edge_density >= _LEAF_EDGE_DENSITY_MIN and
        edge_density <= _LEAF_EDGE_DENSITY_MAX and
        avg_saturation >= _LEAF_SATURATION_MIN and
        skin_ratio < _SKIN_RATIO_MAX):
        return True, "ok"

    # Default reject
    return False, "no_vegetation"


def predict_pil_image(img: Image.Image, lang: str = "en") -> dict:
    # --- Leaf validation gate ---
    is_leaf, reject_reason = _is_likely_leaf(img)
    if not is_leaf:
        return {
            "disease": "not_a_leaf",
            "confidence": 0.0,
            "low_confidence": True,
            "not_a_leaf": True,
            "reject_reason": reject_reason,
            "report": {
                "status": "Not a Plant Leaf",
                "cause": [
                    "The image does not appear to be a coconut leaf or plant.",
                    "Please point the camera at a coconut leaf for accurate disease detection.",
                ],
                "symptoms": [],
                "remedies": [
                    "Ensure the leaf fills most of the frame.",
                    "Use good lighting and avoid shadows.",
                    "Hold the camera steady and close to the leaf.",
                ],
                "prevention": [],
                "fertilizers": [],
            },
            "lang": (lang or "en").strip().lower(),
        }

    # --- Disease classification ---
    model, classes = _get_model_and_classes()
    x = tfm(img.convert("RGB")).unsqueeze(0).to(device)

    with torch.no_grad():
        out = model(x)
        prob = torch.softmax(out, 1)
        conf, pred = torch.max(prob, 1)

    disease = classes[pred.item()]
    confidence = float(conf.item())
    low_confidence = confidence < _CONFIDENCE_THRESHOLD

    return {
        "disease": disease,
        "confidence": confidence,
        "low_confidence": low_confidence,
        "not_a_leaf": False,
        "report": get_report(disease, lang),
        "lang": (lang or "en").strip().lower(),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "device": str(device),
        "classes": len(class_names),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...), lang: str = Form("en")):
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    return predict_pil_image(img, lang=lang)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python infer.py <path_to_image>")

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image not found: {img_path}")

    img = Image.open(img_path).convert("RGB")
    result = predict_pil_image(img)
    print("Disease:", result["disease"])
    print("Confidence:", round(result["confidence"] * 100, 2), "%")
    if result["low_confidence"]:
        print("⚠️  Low confidence — please retake image")
