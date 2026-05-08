import shutil
import tempfile
import os
import time
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from cv_tracker import analyze_video
from physics_analysis import analyze_physics


app = FastAPI(title="PhysiVision CV API")

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
] or DEFAULT_ALLOWED_ORIGINS
max_analysis_frames = int(os.getenv("MAX_ANALYSIS_FRAMES", "180"))
frame_stride = int(os.getenv("FRAME_STRIDE", "1"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


def _analyze_video_path(video_path, output_dir, mass):
    result = analyze_video(
        video_path,
        output_dir=output_dir,
        max_frames=max_analysis_frames,
        frame_stride=frame_stride,
    )
    physics = analyze_physics(result["centers"], result["fps"], mass)

    return {
        "samples": result["samples"],
        "fps": result["fps"],
        "dt": result["dt"],
        "centers": result["centers"],
        "physics": physics,
    }


@app.post("/api/analyze-sample")
def analyze_sample(mass: float = Form(...)):
    started_at = time.perf_counter()
    sample_path = Path(__file__).with_name("actualspring.mp4")

    if not sample_path.exists():
        raise HTTPException(status_code=404, detail="Sample video is not available on the backend.")

    with tempfile.TemporaryDirectory(prefix="physivision-sample-") as temp_dir:
        try:
            payload = _analyze_video_path(sample_path, Path(temp_dir), mass)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    payload["processingSeconds"] = round(time.perf_counter() - started_at, 2)
    return payload


@app.post("/api/analyze")
def analyze(file: UploadFile = File(...), mass: float = Form(...)):
    started_at = time.perf_counter()
    suffix = Path(file.filename or "upload.mp4").suffix or ".mp4"

    with tempfile.TemporaryDirectory(prefix="physivision-") as temp_dir:
        temp_path = Path(temp_dir)
        video_path = temp_path / f"upload{suffix}"

        with video_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        try:
            payload = _analyze_video_path(video_path, temp_path, mass)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

        payload["processingSeconds"] = round(time.perf_counter() - started_at, 2)
        return payload
