// src/ffmpegHelper.ts
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

export const loadFfmpegCore = async (
  ffmpeg: FFmpeg,
  setStatus: (msg: string) => void
) => {
  setStatus("Se încarcă ffmpeg-core...");
  const coreURL = await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm");

  await ffmpeg.load({ coreURL, wasmURL });
  setStatus("ffmpeg-core încărcat cu succes.");
};

export const buildTrimCommand = (start: string, end: string): string[] => {
  const command = ["-i", "input.mp4"];
  if (start) command.push("-ss", start);
  if (end) command.push("-to", end);
  command.push("-c", "copy", "output.mp4");
  return command;
};
