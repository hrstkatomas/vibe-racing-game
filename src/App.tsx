import { useRaceNetwork } from "./hooks/useRaceNetwork";
import { RaceScene } from "./game/RaceScene";

export default function App() {
  const net = useRaceNetwork();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <RaceScene net={net} />

      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          padding: "12px 14px",
          borderRadius: 12,
          background: "rgba(10, 14, 22, 0.72)",
          border: "1px solid rgba(255,255,255,0.10)",
          maxWidth: 420,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 650, letterSpacing: 0.2 }}>RC Racing</div>
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.82, lineHeight: 1.45 }}>
          Drive with <b>WASD</b> or arrow keys. You share a track with everyone in the same room.
        </div>
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
          Party:{" "}
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
            {net.status}
          </span>
          {" · "}
          Players online: <b>{1 + net.remoteIds.length}</b>
        </div>
        {net.error ? (
          <div style={{ marginTop: 10, fontSize: 12, color: "#ffb4b4" }}>{net.error}</div>
        ) : null}
        <div style={{ marginTop: 10, fontSize: 11, opacity: 0.65, lineHeight: 1.45 }}>
          Dev: run <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>npm run dev</span> (Vite + PartyKit).
          Prod: deploy this site to Vercel, deploy PartyKit with{" "}
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>npm run party:deploy</span>, then set{" "}
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>VITE_PARTYKIT_HOST</span> on Vercel.
        </div>
      </div>
    </div>
  );
}
