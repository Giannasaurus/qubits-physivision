import { useEffect, useRef, useState } from "react";
import uploadIcon from "../assets/icons/upload.svg";

function VideoPreview({ videoUrl }) {
  return <video className="video-preview" controls src={videoUrl} autoplay muted />;
}

export default function Dropzone() {
  const [videoUrl, setVideoUrl] = useState(null);
  const replaceFileInputRef = useRef(null);

  function handleReplaceFileClick() {
    replaceFileInputRef.current.click();
  }

  function previewSelectedVideo(e) {
    const video = e.target.files[0];

    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);
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
          <footer id="dropzone__btnGroup">
            <button
              id="replace-file-btn"
              type="button"
              onClick={handleReplaceFileClick}
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
            <button id="upload-analyze-btn" type="submit">
              Upload & Analyze
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
