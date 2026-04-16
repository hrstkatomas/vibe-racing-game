import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type CSSProperties, type MutableRefObject, useRef } from "react";

export type LapHudRef = {
  completedLaps: number;
  lapStartMs: number;
  lastLapMs: number | null;
};

function formatClock(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0.00";
  const totalS = ms / 1000;
  if (totalS < 60) return totalS.toFixed(2);
  const m = Math.floor(totalS / 60);
  const s = totalS - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

function formatLast(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalS = ms / 1000;
  if (totalS < 60) return `${totalS.toFixed(2)} s`;
  const m = Math.floor(totalS / 60);
  const s = totalS - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

const panel: CSSProperties = {
  position: "absolute",
  right: 18,
  top: 18,
  padding: "12px 14px",
  borderRadius: 12,
  background: "rgba(10, 14, 22, 0.78)",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(8px)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  color: "rgba(245,248,255,0.95)",
  minWidth: 148,
  pointerEvents: "none",
};

const row = { display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13, marginTop: 6 } as const;
const label = { opacity: 0.68, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 0.6 };

export function LapHud({ stateRef }: { stateRef: MutableRefObject<LapHudRef> }) {
  const lapEl = useRef<HTMLSpanElement>(null);
  const curEl = useRef<HTMLSpanElement>(null);
  const lastEl = useRef<HTMLSpanElement>(null);

  useFrame(() => {
    const s = stateRef.current;
    const now = performance.now();
    const cur = now - s.lapStartMs;
    if (lapEl.current) lapEl.current.textContent = String(Math.max(1, s.completedLaps + 1));
    if (curEl.current) curEl.current.textContent = formatClock(cur);
    if (lastEl.current) lastEl.current.textContent = s.lastLapMs == null ? "—" : formatLast(s.lastLapMs);
  });

  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div style={panel}>
        <div style={{ fontSize: 11, fontWeight: 650, letterSpacing: 0.4, opacity: 0.9 }}>Timing</div>
        <div style={{ ...row, marginTop: 8 }}>
          <span style={label}>Lap #</span>
          <span ref={lapEl}>1</span>
        </div>
        <div style={row}>
          <span style={label}>Current</span>
          <span ref={curEl}>0.00</span>
        </div>
        <div style={row}>
          <span style={label}>Last</span>
          <span ref={lastEl}>—</span>
        </div>
      </div>
    </Html>
  );
}
