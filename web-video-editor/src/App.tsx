// src/App.tsx
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { loadFfmpegCore, buildTrimCommand, applyFadeIn } from "./ffmpegHelper";
import TimelineEditor from "./components/TimelineEditor";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState("");
  const [status, setStatus] = useState("Așteptare...");
  const [processing, setProcessing] = useState(false);
  const [fadeInStart, setFadeInStart] = useState<number>(0); // Momentul de început
  const [fadeInDuration, setFadeInDuration] = useState<number>(3); // Durata fade in

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
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setOutputURL("");
    setStatus(`Fișierul ${file.name} încărcat.`);

    // Procesăm videoclipul imediat după ce este selectat
    setProcessing(true);
    setStatus("Se procesează video-ul...");
    try {
      const ffmpeg = ffmpegRef.current;
      const fileData = await fetchFile(file);
      await ffmpeg.writeFile("input.mp4", fileData);

      const command = buildTrimCommand("", ""); // Procesăm întregul videoclip
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

  const applyFadeInEffect = async () => {
    if (!outputURL) {
      setStatus("Nu există un videoclip procesat pentru a aplica fade in.");
      return;
    }

    setProcessing(true);
    setStatus("Se aplică efectul de fade in...");
    try {
      const ffmpeg = ffmpegRef.current;

      // Citește fișierul procesat anterior
      const fileData = await fetch(outputURL).then((res) => res.arrayBuffer());
      await ffmpeg.writeFile("processed.mp4", new Uint8Array(fileData));

      // Aplică efectul de fade in
      await applyFadeIn(
        ffmpeg,
        "processed.mp4",
        "fadein_output.mp4",
        fadeInStart,
        fadeInDuration
      );

      // Citește fișierul rezultat
      const data = await ffmpeg.readFile("fadein_output.mp4");
      const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
      setOutputURL(url);
      setStatus("Efectul de fade in a fost aplicat cu succes!");
    } catch (error) {
      setStatus("Eroare la aplicarea efectului de fade in.");
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
          fadeInStart={fadeInStart}
          fadeInDuration={fadeInDuration}
          setFadeInStart={setFadeInStart}
          setFadeInDuration={setFadeInDuration}
          onApplyFadeIn={applyFadeInEffect}
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
