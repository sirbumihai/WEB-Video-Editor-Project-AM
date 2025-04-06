// src/App.tsx
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { loadFfmpegCore, buildTrimCommand } from "./ffmpegHelper";
import TimelineEditor from "./components/TimelineEditor";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState("");
  const [status, setStatus] = useState("Așteptare...");
  const [processing, setProcessing] = useState(false);

  // Parametri "trim"
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const ffmpegRef = useRef(new FFmpeg());

  // Încărcăm ffmpeg-core la montare
  useEffect(() => {
    const initFfmpeg = async () => {
      try {
        await loadFfmpegCore(ffmpegRef.current, setStatus);
        setLoaded(true);
      } catch (err) {
        console.error("Eroare la init ffmpeg", err);
      }
    };
    initFfmpeg();
  }, []);

  // Upload fișier video
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setOutputURL("");
    setStatus(`Fișierul ${file.name} încărcat.`);
  };

  // Procesare video (trim)
  const processVideo = async () => {
    if (!videoFile) {
      setStatus("Selectați un fișier video.");
      return;
    }
    setProcessing(true);
    setStatus("Se procesează video-ul...");

    const ffmpeg = ffmpegRef.current;
    try {
      const fileData = await fetchFile(videoFile);
      await ffmpeg.writeFile("input.mp4", fileData);

      const command = buildTrimCommand(startTime, endTime);
      await ffmpeg.exec(command);

      const data = await ffmpeg.readFile("output.mp4");
      const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
      setOutputURL(url);
      setStatus("Procesare completă!");
    } catch (error) {
      setStatus("Eroare la procesarea video-ului.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  // Reset
  const reset = () => {
    setVideoFile(null);
    setOutputURL("");
    setStartTime("");
    setEndTime("");
    setStatus("Așteptare...");
  };

  return (
    <>
      {loaded ? (
        <TimelineEditor
          videoFileName={videoFile?.name || null}
          outputURL={outputURL}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          onFileChange={handleFileChange}
          onProcess={processVideo}
          onReset={reset}
          processing={processing}
          status={status}
        />
      ) : (
        <p style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          Se încarcă ffmpeg-core...
        </p>
      )}
    </>
  );
}

export default App;
