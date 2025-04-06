// src/components/VideoPlayerWithTimeline.tsx
import React, { useRef, useState } from "react";

type VideoPlayerWithTimelineProps = {
  src: string; // URL-ul video-ului (Blob generat de ffmpeg sau fișier local)
  width?: number; // Lățimea timeline-ului (px)
  height?: number; // Înălțimea timeline-ului (px)
};

const VideoPlayerWithTimeline = ({
  src,
  width = 600,
  height = 80,
}: VideoPlayerWithTimelineProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0); // Durata totală a video-ului (secunde)
  const [currentTime, setCurrentTime] = useState(0); // Timpul curent (secunde)

  // La încărcarea metadatelor, actualizăm durata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // La fiecare "timeupdate", actualizăm currentTime
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Când se face click pe timeline, calculăm poziția și setăm timpul curent în video
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // poziția clickului în timeline
    const ratio = clickX / rect.width; // cât la sută din timeline reprezintă clickul
    const newTime = ratio * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Poziția playhead-ului în pixeli
  const playheadPosition = duration ? (currentTime / duration) * width : 0;

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Playerul video */}
      <video
        ref={videoRef}
        src={src}
        width={600}
        controls
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        style={{ background: "#000" }}
      />

      {/* Timeline-ul personalizat */}
      <div
        ref={timelineRef}
        onClick={handleTimelineClick}
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          background: "#333",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        {/* „Clip”-ul (doar un fundal albastru care simbolizează durata totală) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "#555",
          }}
        >
          {/* Aici ai putea desena segmente de clipuri, waveforms, etc. */}
        </div>

        {/* Playhead-ul (linia verticală) */}
        <div
          style={{
            position: "absolute",
            left: `${playheadPosition}px`,
            top: 0,
            width: "2px",
            height: "100%",
            background: "red",
            pointerEvents: "none", // să nu blocheze click-ul pe timeline
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayerWithTimeline;
