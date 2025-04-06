import React, { useRef, useState, useEffect } from "react";

type VideoPlayerWithTimelineProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>; // Referința către playerul video
};

const VideoPlayerWithTimeline = ({
  videoRef,
}: VideoPlayerWithTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0); // Durata totală a video-ului (secunde)
  const [currentTime, setCurrentTime] = useState(0); // Timpul curent (secunde)

  // Actualizăm durata și timpul curent folosind referința către playerul video
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [videoRef]);

  // Când se face click pe timeline, calculăm poziția și setăm timpul curent în video
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0 || !videoRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Poziția clickului în timeline
    const ratio = clickX / rect.width; // Proporția clickului față de lungimea timeline-ului
    const newTime = ratio * duration;
    videoRef.current.currentTime = newTime; // Setăm timpul curent în video
  };

  // Formatează timpul în MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Generează marcaje de timp pentru timeline
  const generateTimeMarkers = () => {
    const markers = [];
    const interval = Math.max(Math.floor(duration / 10), 1); // Marcaje la fiecare 10% din durată
    for (let i = 0; i <= duration; i += interval) {
      const position = (i / duration) * 100; // Poziția în procente
      markers.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${position}%`,
            top: 0,
            height: "100%",
            width: "1px",
            background: "#888",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "-10px",
              fontSize: "10px",
              color: "#fff",
            }}
          >
            {formatTime(i)}
          </span>
        </div>
      );
    }
    return markers;
  };

  return (
    <div
      style={{
        marginTop: "10px",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Marcaje de timp */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          position: "absolute",
        }}
      >
        <span style={{ float: "left" }}>{formatTime(currentTime)}</span>
        <span style={{ float: "right" }}>{formatTime(duration)}</span>
      </div>

      {/* Timeline-ul personalizat */}
      <div
        ref={timelineRef}
        onClick={handleTimelineClick}
        style={{
          position: "fixed",
          width: "100%", // Full width pentru a fi încadrat corect
          height: "100%",
          background: "#444",
          borderRadius: "5px",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {/* Fundalul timeline-ului */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "#555",
          }}
        ></div>

        {/* Marcaje de timp */}
        {generateTimeMarkers()}

        {/* Playhead-ul (sageata) */}
        <div
          style={{
            position: "absolute",
            left: `${(currentTime / duration) * 100}%`,
            top: 0,
            width: "0",
            height: "0",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "12px solid red", // Sageata deasupra timeline-ului
            transform: "translateX(8px)", // Centrare pe poziția playhead-ului
            rotate: "180deg",
            pointerEvents: "none", // Să nu blocheze click-ul pe timeline
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${(currentTime / duration) * 100}%`,
            top: 0,
            width: "2px",
            height: "100%",
            background: "red", // Linia verticală sub săgeată
            transform: "translate(-50%, 0)", // Centrare pe poziția playhead-ului
            pointerEvents: "none", // Să nu blocheze click-ul pe timeline
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayerWithTimeline;
