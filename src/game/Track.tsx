import { useMemo } from "react";
import * as THREE from "three";
import { CIRCUIT } from "./constants";

const wallH = 1.25;
const t = 1.1;
const { innerHalfX: ix, innerHalfZ: iz, outerHalfX: ox, outerHalfZ: oz } = CIRCUIT;

export function Track() {
  const ringGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-ox, -oz);
    shape.lineTo(ox, -oz);
    shape.lineTo(ox, oz);
    shape.lineTo(-ox, oz);
    shape.lineTo(-ox, -oz);

    const hole = new THREE.Path();
    hole.moveTo(-ix, -iz);
    hole.lineTo(-ix, iz);
    hole.lineTo(ix, iz);
    hole.lineTo(ix, -iz);
    hole.lineTo(-ix, -iz);
    shape.holes.push(hole);

    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.07, 0);
    return g;
  }, []);

  const ground = Math.max(ox, oz) + 14;

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ground * 2, ground * 2]} />
        <meshStandardMaterial color="#1b2433" roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[ix * 2, iz * 2]} />
        <meshStandardMaterial color="#1e3d2a" roughness={0.92} metalness={0.04} />
      </mesh>

      <mesh receiveShadow geometry={ringGeom}>
        <meshStandardMaterial color="#2a3548" roughness={0.9} metalness={0.08} />
      </mesh>

      <KerbStrip position={[0, 0.009, iz]} size={[ox * 2, 0.28]} />
      <KerbStrip position={[0, 0.009, -iz]} size={[ox * 2, 0.28]} />
      <KerbStrip position={[ix, 0.009, 0]} size={[0.28, iz * 2]} />
      <KerbStrip position={[-ix, 0.009, 0]} size={[0.28, iz * 2]} />

      <Wall position={[0, wallH / 2, oz + t / 2]} size={[ox * 2 + t * 2, wallH, t]} />
      <Wall position={[0, wallH / 2, -oz - t / 2]} size={[ox * 2 + t * 2, wallH, t]} />
      <Wall position={[ox + t / 2, wallH / 2, 0]} size={[t, wallH, oz * 2 + t * 2]} />
      <Wall position={[-ox - t / 2, wallH / 2, 0]} size={[t, wallH, oz * 2 + t * 2]} />

      {/* Start/finish on south straight */}
      <mesh position={[0, 0.045, -iz - (oz - iz) * 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 0.45]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.35} emissive="#ffffff" emissiveIntensity={0.06} />
      </mesh>
    </group>
  );
}

function KerbStrip({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#f2c14e" roughness={0.55} emissive="#2a1a00" emissiveIntensity={0.12} />
    </mesh>
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
