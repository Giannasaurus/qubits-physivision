import { useEffect, useRef, useState } from "react";
import uploadIcon from "../assets/icons/upload.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function VideoPreview({ videoUrl }) {
  return <video className="video-preview" controls src={videoUrl} autoPlay muted />;
}

export default function Dropzone() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [mass, setMass] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const replaceFileInputRef = useRef(null);

  function handleReplaceFileClick() {
    replaceFileInputRef.current.click();
  }

  function previewSelectedVideo(e) {
    const video = e.target.files[0];

    if (video) {
      const url = URL.createObjectURL(video);
      setSelectedVideo(video);
      setVideoUrl(url);
      setAnalysis(null);
      setError("");
    }
  }

  async function handleAnalyze() {
    const parsedMass = Number(mass);
    if (!selectedVideo || isAnalyzing || parsedMass <= 0) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedVideo);
    formData.append("mass", parsedMass);

    setIsAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || "Analysis failed.");
      }

      setAnalysis(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <main>
      <div id="dropzone">
        {videoUrl && <VideoPreview videoUrl={videoUrl} />}

        {!videoUrl && (
          <label id="dropzone__clickable" htmlFor="uploadFileBtn">
            <div id="dropzone__area">
              <img id="uploadIcon" src={uploadIcon} alt="Upload icon" />
              <p>Drag & drop to upload</p>
              <input
                id="uploadFileBtn"
                className="invisible"
                type="file"
                accept="video/*"
                onChange={previewSelectedVideo}
              />
              <label id="uploadFileLabel" htmlFor="uploadFileBtn">
                Choose File
              </label>
            </div>
          </label>
        )}

        {videoUrl && (
          <div className="analysis-controls">
            <label htmlFor="massInput">Mass (kg)</label>
            <input
              id="massInput"
              min="0"
              step="0.001"
              type="number"
              value={mass}
              onChange={(event) => setMass(event.target.value)}
              placeholder="0.250"
            />
          </div>
        )}

        {videoUrl && (
          <footer id="dropzone__btnGroup">
            <button
              id="replace-file-btn"
              type="button"
              onClick={handleReplaceFileClick}
              disabled={isAnalyzing}
            >
              Replace File
            </button>
            <input
              ref={replaceFileInputRef}
              className="invisible"
              type="file"
              accept="video/*"
              onChange={previewSelectedVideo}
            />
            <button
              id="upload-analyze-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || Number(mass) <= 0}
            >
              {isAnalyzing ? "Analyzing..." : "Upload & Analyze"}
            </button>
          </footer>
        )}

        {error && <p className="analysis-message analysis-message--error">{error}</p>}

        {analysis && (
          <section className="analysis-results" aria-live="polite">
            <h2>Tracking Results</h2>
            <dl>
              <div>
                <dt>Samples</dt>
                <dd>{analysis.samples}</dd>
              </div>
              <div>
                <dt>FPS</dt>
                <dd>{analysis.fps.toFixed(2)}</dd>
              </div>
              <div>
                <dt>dt</dt>
                <dd>{analysis.dt.toFixed(4)}s</dd>
              </div>
              <div>
                <dt>Regime</dt>
                <dd>{analysis.physics.regime}</dd>
              </div>
              <div>
                <dt>k</dt>
                <dd>{analysis.physics.springConstant.toFixed(3)}</dd>
              </div>
              <div>
                <dt>Damping</dt>
                <dd>{analysis.physics.gamma.toFixed(3)}</dd>
              </div>
              <div>
                <dt>omega0</dt>
                <dd>{analysis.physics.omega0.toFixed(3)}</dd>
              </div>
              <div>
                <dt>NRMSE</dt>
                <dd>{analysis.physics.nrmse.toFixed(3)}</dd>
              </div>
              <div>
                <dt>Peaks</dt>
                <dd>{analysis.physics.peakCount}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
