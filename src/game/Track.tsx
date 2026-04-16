import { ARENA_HALF } from "./constants";

const W = ARENA_HALF + 2.5;
const wallH = 1.25;
const t = 1.1;

export function Track() {
  const ground = ARENA_HALF + 6;
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ground * 2, ground * 2]} />
        <meshStandardMaterial color="#1b2433" roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[ARENA_HALF * 2, ARENA_HALF * 2]} />
        <meshStandardMaterial color="#2a3548" roughness={0.9} metalness={0.08} />
      </mesh>

      {/* Racing border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[ARENA_HALF - 0.25, ARENA_HALF, 64]} />
        <meshStandardMaterial color="#f2c14e" roughness={0.55} emissive="#2a1a00" emissiveIntensity={0.15} />
      </mesh>

      <Wall position={[W, wallH / 2, 0]} size={[t, wallH, W * 2]} />
      <Wall position={[-W, wallH / 2, 0]} size={[t, wallH, W * 2]} />
      <Wall position={[0, wallH / 2, W]} size={[W * 2, wallH, t]} />
      <Wall position={[0, wallH / 2, -W]} size={[W * 2, wallH, t]} />

      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.6, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} emissive="#ffffff" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function Wall({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#10151f" roughness={0.65} metalness={0.15} />
    </mesh>
  );
}
