// src/components/TimelineEditor.tsx
import React from "react";
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
  return (
    <div className="editor-layout" style={{ display: "flex", height: "100vh" }}>
      {/* Conținut principal */}
      <main
        style={{
          flex: 1,
          background: "#1c1c1c",
          color: "#fff",
          padding: "10px",
        }}
      >
        <h2>Editor Video - Stil WeVideo</h2>
        <h3>Media</h3>
        <div style={{ marginTop: "10px" }}>
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            disabled={processing}
          />
        </div>
        <p style={{ marginTop: "10px" }}>{videoFileName || "Niciun fișier"}</p>
        <p style={{ marginTop: "5px" }}>{status}</p>

        {/* Previzualizare + timeline */}
        {outputURL ? (
          <VideoPlayerWithTimeline src={outputURL} />
        ) : (
          <p style={{ marginTop: "10px" }}>Nu există video de previzualizat</p>
        )}
        {/* Efecte de tranziție */}
        <div style={{ marginTop: "10px" }}>
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
      </main>
    </div>
  );
};

export default TimelineEditor;
