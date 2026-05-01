"""
IoT Integration Module for Coconut Disease Detection — v2
==========================================================
Real-time architecture: SQLite storage + WebSocket broadcast.
Does NOT modify existing prediction logic.
"""

import asyncio
import io
import json
import os
import random
import sqlite3
import string
import time
from collections import Counter
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from PIL import Image

from .infer import predict_pil_image

router = APIRouter(prefix="/iot", tags=["IoT"])


# ═══════════════════════════════════════════════════
# WebSocket Connection Manager
# ═══════════════════════════════════════════════════
class ConnectionManager:
    """Manages active WebSocket clients and broadcasts updates."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send a JSON message to all connected clients."""
        dead = []
        for ws in self.active_connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    @property
    def client_count(self) -> int:
        return len(self.active_connections)


ws_manager = ConnectionManager()


# ═══════════════════════════════════════════════════
# SQLite Database
# ═══════════════════════════════════════════════════
_DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "..", "iot_trees.db"
)
_DB_PATH = os.path.abspath(_DB_PATH)


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def _init_db():
    conn = _get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS trees (
            tree_id     TEXT PRIMARY KEY,
            uid         TEXT NOT NULL,
            disease     TEXT,
            confidence  REAL,
            lat         REAL,
            lng         REAL,
            last_scan   TEXT,
            scan_count  INTEGER DEFAULT 0,
            smoothed    INTEGER DEFAULT 0,
            low_confidence INTEGER DEFAULT 0,
            report_json TEXT
        );

        CREATE TABLE IF NOT EXISTS scan_history (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            tree_id     TEXT NOT NULL,
            uid         TEXT NOT NULL,
            disease     TEXT,
            confidence  REAL,
            lat         REAL,
            lng         REAL,
            scanned_at  TEXT NOT NULL,
            smoothed    INTEGER DEFAULT 0,
            low_confidence INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_history_tree
            ON scan_history(tree_id);
        CREATE INDEX IF NOT EXISTS idx_history_time
            ON scan_history(scanned_at DESC);
    """)
    conn.close()


# Initialize on import
_init_db()


def _uid_to_tree_id(uid: str) -> str:
    """Map RFID UID → tree_id. Auto-registers new UIDs."""
    conn = _get_conn()
    row = conn.execute("SELECT tree_id FROM trees WHERE uid = ?", (uid,)).fetchone()
    if row:
        conn.close()
        return row["tree_id"]
    # Count existing trees and assign next ID
    count = conn.execute("SELECT COUNT(*) as c FROM trees").fetchone()["c"]
    tree_id = f"TREE-{count + 1:04d}"
    conn.close()
    return tree_id


def _save_tree(tree_id: str, record: dict):
    """Upsert tree record and append to scan history."""
    conn = _get_conn()
    conn.execute("""
        INSERT INTO trees (tree_id, uid, disease, confidence, lat, lng,
                           last_scan, scan_count, smoothed, low_confidence, report_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tree_id) DO UPDATE SET
            disease = excluded.disease,
            confidence = excluded.confidence,
            lat = excluded.lat,
            lng = excluded.lng,
            last_scan = excluded.last_scan,
            scan_count = excluded.scan_count,
            smoothed = excluded.smoothed,
            low_confidence = excluded.low_confidence,
            report_json = excluded.report_json
    """, (
        tree_id,
        record["uid"],
        record["disease"],
        record["confidence"],
        record.get("lat"),
        record.get("lng"),
        record["last_scan"],
        record["scan_count"],
        1 if record.get("smoothed") else 0,
        1 if record.get("low_confidence") else 0,
        json.dumps(record.get("report", {})),
    ))
    # Append to history
    conn.execute("""
        INSERT INTO scan_history (tree_id, uid, disease, confidence, lat, lng,
                                  scanned_at, smoothed, low_confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tree_id,
        record["uid"],
        record["disease"],
        record["confidence"],
        record.get("lat"),
        record.get("lng"),
        record["last_scan"],
        1 if record.get("smoothed") else 0,
        1 if record.get("low_confidence") else 0,
    ))
    conn.commit()
    conn.close()


def _get_all_trees() -> list[dict]:
    conn = _get_conn()
    rows = conn.execute(
        "SELECT * FROM trees ORDER BY last_scan DESC"
    ).fetchall()
    conn.close()
    trees = []
    for r in rows:
        trees.append({
            "tree_id": r["tree_id"],
            "uid": r["uid"],
            "disease": r["disease"],
            "confidence": r["confidence"],
            "location": {"lat": r["lat"], "lng": r["lng"]} if r["lat"] else None,
            "last_scan": r["last_scan"],
            "scan_count": r["scan_count"],
            "smoothed": bool(r["smoothed"]),
            "low_confidence": bool(r["low_confidence"]),
        })
    return trees


def _get_stats() -> dict:
    conn = _get_conn()
    total = conn.execute("SELECT COUNT(*) as c FROM trees").fetchone()["c"]
    healthy = conn.execute(
        "SELECT COUNT(*) as c FROM trees WHERE disease = 'Healthy_Leaves'"
    ).fetchone()["c"]
    rows = conn.execute(
        "SELECT disease, COUNT(*) as c FROM trees GROUP BY disease"
    ).fetchall()
    conn.close()
    return {
        "total_trees": total,
        "healthy": healthy,
        "diseased": total - healthy,
        "disease_distribution": {r["disease"]: r["c"] for r in rows},
    }


def _get_scan_history(limit: int = 50) -> list[dict]:
    conn = _get_conn()
    rows = conn.execute(
        "SELECT * FROM scan_history ORDER BY scanned_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "tree_id": r["tree_id"],
            "uid": r["uid"],
            "disease": r["disease"],
            "confidence": r["confidence"],
            "location": {"lat": r["lat"], "lng": r["lng"]} if r["lat"] else None,
            "scanned_at": r["scanned_at"],
            "smoothed": bool(r["smoothed"]),
            "low_confidence": bool(r["low_confidence"]),
        }
        for r in rows
    ]


# ═══════════════════════════════════════════════════
# Prediction smoothing (majority vote over last N)
# ═══════════════════════════════════════════════════
_prediction_history: dict[str, list] = {}
_SMOOTHING_WINDOW = 5
_CONFIDENCE_THRESHOLD = 0.70


def _smoothed_prediction(tree_id: str, new_pred: dict) -> dict:
    if new_pred["confidence"] < _CONFIDENCE_THRESHOLD:
        new_pred["low_confidence"] = True
        return new_pred

    if tree_id not in _prediction_history:
        _prediction_history[tree_id] = []

    _prediction_history[tree_id].append(new_pred)
    _prediction_history[tree_id] = _prediction_history[tree_id][-_SMOOTHING_WINDOW:]

    votes = Counter(p["disease"] for p in _prediction_history[tree_id])
    majority_disease = votes.most_common(1)[0][0]

    result = dict(new_pred)
    result["disease"] = majority_disease
    result["smoothed"] = True
    result["vote_count"] = dict(votes)
    result["low_confidence"] = False
    return result


# ═══════════════════════════════════════════════════
# Debounce tracker
# ═══════════════════════════════════════════════════
_last_scan_time: dict[str, float] = {}
_DEBOUNCE_SECONDS = 5


# ═══════════════════════════════════════════════════
# WebSocket endpoint
# ═══════════════════════════════════════════════════
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Real-time WebSocket connection.
    On connect → sends current state.
    Stays open → receives broadcast updates after every scan.
    """
    await ws_manager.connect(websocket)
    try:
        # Send initial state
        await websocket.send_json({
            "type": "init",
            "trees": _get_all_trees(),
            "stats": _get_stats(),
            "history": _get_scan_history(30),
            "clients": ws_manager.client_count,
        })
        # Keep alive — listen for pings or messages
        while True:
            data = await websocket.receive_text()
            # Handle ping/pong keep-alive
            if data == "ping":
                await websocket.send_json({"type": "pong"})
            elif data == "refresh":
                await websocket.send_json({
                    "type": "state",
                    "trees": _get_all_trees(),
                    "stats": _get_stats(),
                    "history": _get_scan_history(30),
                    "clients": ws_manager.client_count,
                })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        # Notify remaining clients about connection count change
        await ws_manager.broadcast({
            "type": "clients",
            "clients": ws_manager.client_count,
        })
    except Exception:
        ws_manager.disconnect(websocket)


# ═══════════════════════════════════════════════════
# REST Endpoints
# ═══════════════════════════════════════════════════

@router.post("/scan")
async def iot_scan(
    file: UploadFile = File(...),
    uid: str = Form(...),
    lang: str = Form("en"),
    lat: Optional[str] = Form(None),
    lng: Optional[str] = Form(None),
):
    """
    Main IoT scan endpoint.
    RFID UID + image + optional GPS → prediction → store → broadcast.
    """
    # Debounce check
    now = time.time()
    if uid in _last_scan_time:
        elapsed = now - _last_scan_time[uid]
        if elapsed < _DEBOUNCE_SECONDS:
            return JSONResponse(
                status_code=429,
                content={
                    "error": f"Duplicate scan. Wait {_DEBOUNCE_SECONDS - elapsed:.1f}s.",
                    "debounced": True,
                },
            )
    _last_scan_time[uid] = now

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Run existing prediction (untouched)
        raw_result = predict_pil_image(image, lang)

        # Map UID → tree
        tree_id = _uid_to_tree_id(uid)

        # Apply smoothing
        smoothed = _smoothed_prediction(tree_id, raw_result)

        # Build location
        loc_lat, loc_lng = None, None
        if lat and lng:
            try:
                loc_lat, loc_lng = float(lat), float(lng)
            except (ValueError, TypeError):
                pass

        # Get current scan_count
        conn = _get_conn()
        existing = conn.execute(
            "SELECT scan_count FROM trees WHERE tree_id = ?", (tree_id,)
        ).fetchone()
        conn.close()
        prev_count = existing["scan_count"] if existing else 0

        scan_time = datetime.now(timezone.utc).isoformat()

        # Store in SQLite
        record = {
            "uid": uid,
            "disease": smoothed["disease"],
            "confidence": smoothed["confidence"],
            "lat": loc_lat,
            "lng": loc_lng,
            "last_scan": scan_time,
            "report": smoothed.get("report", {}),
            "smoothed": smoothed.get("smoothed", False),
            "low_confidence": smoothed.get("low_confidence", False),
            "scan_count": prev_count + 1,
        }
        _save_tree(tree_id, record)

        # Build response
        location = {"lat": loc_lat, "lng": loc_lng} if loc_lat else None
        response = {
            "tree_id": tree_id,
            "disease": smoothed["disease"],
            "confidence": smoothed["confidence"],
            "location": location,
            "last_scan": scan_time,
            "smoothed": smoothed.get("smoothed", False),
            "vote_count": smoothed.get("vote_count"),
            "low_confidence": smoothed.get("low_confidence", False),
            "report": smoothed.get("report", {}),
        }

        # ── Broadcast to all WebSocket clients ──
        await ws_manager.broadcast({
            "type": "scan_result",
            "data": response,
            "trees": _get_all_trees(),
            "stats": _get_stats(),
            "history": _get_scan_history(30),
            "clients": ws_manager.client_count,
        })

        return JSONResponse(content=response)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/trees")
async def get_all_trees_endpoint():
    """Return all scanned trees for the dashboard."""
    trees = _get_all_trees()
    return JSONResponse(content={"trees": trees, "total": len(trees)})


@router.get("/tree/{tree_id}")
async def get_tree(tree_id: str):
    """Get details for a specific tree."""
    conn = _get_conn()
    row = conn.execute("SELECT * FROM trees WHERE tree_id = ?", (tree_id,)).fetchone()
    conn.close()
    if not row:
        return JSONResponse(status_code=404, content={"error": "Tree not found"})
    report = {}
    try:
        report = json.loads(row["report_json"]) if row["report_json"] else {}
    except Exception:
        pass
    return JSONResponse(content={
        "tree_id": row["tree_id"],
        "uid": row["uid"],
        "disease": row["disease"],
        "confidence": row["confidence"],
        "location": {"lat": row["lat"], "lng": row["lng"]} if row["lat"] else None,
        "last_scan": row["last_scan"],
        "scan_count": row["scan_count"],
        "smoothed": bool(row["smoothed"]),
        "low_confidence": bool(row["low_confidence"]),
        "report": report,
    })


@router.get("/history")
async def get_history(limit: int = 50):
    """Get scan history for the history panel."""
    return JSONResponse(content={"history": _get_scan_history(limit)})


@router.delete("/trees")
async def clear_trees():
    """Clear all tree data (for testing/reset)."""
    conn = _get_conn()
    conn.execute("DELETE FROM trees")
    conn.execute("DELETE FROM scan_history")
    conn.commit()
    conn.close()
    _prediction_history.clear()
    _last_scan_time.clear()

    # Broadcast reset
    await ws_manager.broadcast({
        "type": "reset",
        "trees": [],
        "stats": _get_stats(),
        "history": [],
        "clients": ws_manager.client_count,
    })

    return JSONResponse(content={"message": "All tree data cleared"})


@router.get("/mock-uid")
async def generate_mock_uid():
    """Generate a simulated RFID UID for testing."""
    uid = "RFID-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return JSONResponse(content={"uid": uid})


@router.get("/stats")
async def get_stats_endpoint():
    """Get summary statistics for the IoT dashboard."""
    stats = _get_stats()
    stats["ws_clients"] = ws_manager.client_count
    return JSONResponse(content=stats)


@router.get("/status")
async def get_device_status():
    """Device status endpoint — reports connectivity."""
    return JSONResponse(content={
        "backend": "online",
        "websocket_clients": ws_manager.client_count,
        "database": "sqlite",
        "db_path": _DB_PATH,
        "uptime": time.time(),
    })
