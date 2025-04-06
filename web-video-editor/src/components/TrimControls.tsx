// src/components/TrimControls.tsx

type TrimControlsProps = {
  startTime: string;
  endTime: string;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;
  onProcess: () => void;
  onReset: () => void;
  processing: boolean;
};

const TrimControls = ({
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  onProcess,
  onReset,
  processing,
}: TrimControlsProps) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <div>
        <label>
          Start Time:
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ marginLeft: "5px" }}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          End Time:
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ marginLeft: "5px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={onProcess} disabled={processing}>
          {processing ? "Procesare..." : "Procesează Video"}
        </button>
        <button
          onClick={onReset}
          style={{ marginLeft: "10px" }}
          disabled={processing}
        >
          Resetează
        </button>
      </div>
    </div>
  );
};

export default TrimControls;
