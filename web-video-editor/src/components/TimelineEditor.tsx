// src/components/TimelineEditor.tsx
import React, { useRef } from "react";
import TrimControls from "./TrimControls";
import VideoPlayerWithTimeline from "./VideoPlayerWithTimeline";

type TimelineEditorProps = {
  // Stările și funcțiile din App.tsx
  videoFileName: string | null;
  outputURL: string;
  startTime: string;
  endTime: string;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  onReset: () => void;
  processing: boolean;
  status: string;
  fadeInStart: number;
  fadeInDuration: number;
  setFadeInStart: (val: number) => void;
  setFadeInDuration: (val: number) => void;
  onApplyFadeIn: () => void;
};

const TimelineEditor = ({
  videoFileName,
  outputURL,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  onFileChange,
  onProcess,
  onReset,
  processing,
  status,
  fadeInStart,
  fadeInDuration,
  setFadeInStart,
  setFadeInDuration,
  onApplyFadeIn,
}: TimelineEditorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null); // Referința către playerul video

  return (
    <div
      className="editor-layout"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Partea de sus */}
      <div style={{ display: "flex", flex: 7, background: "#1c1c1c" }}>
        {/* Stânga: Efecte și Choose File */}
        <div
          style={{
            flex: 1,
            background: "#2b2b2b",
            color: "#fff",
            padding: "10px",
            overflowY: "auto",
          }}
        >
          <h3>Media</h3>
          <div style={{ marginTop: "10px" }}>
            <input
              type="file"
              accept="video/*"
              onChange={onFileChange}
              disabled={processing}
            />
          </div>
          <p style={{ marginTop: "10px" }}>
            {videoFileName || "Niciun fișier"}
          </p>
          <p style={{ marginTop: "5px" }}>{status}</p>

          {/* Efecte Video */}
          <div style={{ marginTop: "20px" }}>
            <h3>Efecte Video</h3>
            <label>
              Fade In Start (secunde):
              <input
                type="number"
                value={fadeInStart}
                onChange={(e) => setFadeInStart(parseFloat(e.target.value))}
                style={{ marginLeft: "5px" }}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              Fade In Duration (secunde):
              <input
                type="number"
                value={fadeInDuration}
                onChange={(e) => setFadeInDuration(parseFloat(e.target.value))}
                style={{ marginLeft: "5px" }}
              />
            </label>
            <button
              onClick={onApplyFadeIn}
              disabled={processing}
              style={{ marginLeft: "10px", padding: "5px 10px" }}
            >
              Aplică Fade In
            </button>
          </div>

          {/* Controale de tăiere */}
          <TrimControls
            startTime={startTime}
            endTime={endTime}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            onProcess={onProcess}
            onReset={onReset}
            processing={processing}
          />
        </div>

        {/* Dreapta: Previzualizare Video */}
        <div
          style={{
            flex: 2,
            background: "#1c1c1c",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {outputURL ? (
            <video
              ref={videoRef} // Adaugă referința aici
              src={outputURL}
              controls
              style={{ width: "70%", maxHeight: "70%" }}
            />
          ) : (
            <p style={{ color: "#fff" }}>Nu există video de previzualizat</p>
          )}
        </div>
      </div>

      {/* Partea de jos: Timeline */}
      <div
        style={{
          flex: 3,
          background: "#333",
          padding: "10px",
          overflowX: "auto",
          height: "30vh",
          width: "100%",
          display: "flex",
          justifyContent: "stretch",
        }}
      >
        {outputURL ? (
          <VideoPlayerWithTimeline videoRef={videoRef} /> // Folosește referința videoRef
        ) : (
          <p style={{ color: "#fff" }}>Nu există timeline de afișat</p>
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;
