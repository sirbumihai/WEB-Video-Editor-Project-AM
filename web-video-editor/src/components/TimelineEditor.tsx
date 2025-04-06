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
