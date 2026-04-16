import { Html } from "@react-three/drei";

type Props = { playerId: string };

export function CarPlayerLabel({ playerId }: Props) {
  return (
    <Html position={[0, 0.92, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "#e8eef8",
          textShadow: "0 1px 2px #000, 0 0 10px #000",
          whiteSpace: "nowrap",
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={playerId}
      >
        {playerId}
      </div>
    </Html>
  );
}
