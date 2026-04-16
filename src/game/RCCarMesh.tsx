import { type MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  color: string;
  speedRef: MutableRefObject<number>;
};

const rubber = {
  color: "#0b0c0f",
  roughness: 0.92,
  metalness: 0.08,
} as const;

const chrome = {
  color: "#d7e2f0",
  metalness: 0.92,
  roughness: 0.22,
} as const;

function Wheel({ wheelRef, x, z }: { wheelRef: MutableRefObject<THREE.Group | null>; x: number; z: number }) {
  return (
    <group ref={wheelRef} position={[x, 0.14, z]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.175, 0.175, 0.13, 22]} />
        <meshStandardMaterial {...rubber} />
      </mesh>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.095, 0.1, 18]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.005, 0, 0]}>
        <torusGeometry args={[0.125, 0.018, 8, 18]} />
        <meshStandardMaterial color="#151922" roughness={0.85} metalness={0.35} />
      </mesh>
    </group>
  );
}

export function RCCarMesh({ color, speedRef }: Props) {
  const fl = useRef<THREE.Group>(null);
  const fr = useRef<THREE.Group>(null);
  const rl = useRef<THREE.Group>(null);
  const rr = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((_, dt) => {
    spin.current += speedRef.current * dt * 0.62;
    const s = spin.current;
    for (const r of [fl, fr, rl, rr]) {
      r.current?.rotation.set(s, 0, 0);
    }
  });

  const bodyMat = {
    color,
    metalness: 0.42,
    roughness: 0.38,
    envMapIntensity: 1.05,
  } as const;

  return (
    <group>
      {/* Lower tub — wider at rear like a pan car */}
      <RoundedBox
        args={[1.16, 0.2, 1.92]}
        radius={0.07}
        smoothness={3}
        position={[0, 0.12, -0.02]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...bodyMat} />
      </RoundedBox>

      <RoundedBox
        args={[0.78, 0.14, 1.55]}
        radius={0.05}
        smoothness={2}
        position={[0, 0.2, -0.02]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...bodyMat} />
      </RoundedBox>

      {/* Side skirts */}
      <mesh castShadow position={[0.58, 0.1, -0.05]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.06, 0.08, 1.45]} />
        <meshStandardMaterial color="#121722" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[-0.58, 0.1, -0.05]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.06, 0.08, 1.45]} />
        <meshStandardMaterial color="#121722" metalness={0.55} roughness={0.45} />
      </mesh>

      {/* Cockpit bubble */}
      <RoundedBox
        args={[0.56, 0.26, 0.62]}
        radius={0.11}
        smoothness={3}
        position={[0, 0.38, 0.02]}
        castShadow
      >
        <meshStandardMaterial
          color="#03060c"
          metalness={0.88}
          roughness={0.12}
          transparent
          opacity={0.78}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Roll hoop */}
      <mesh castShadow position={[0, 0.48, -0.28]} rotation={[0.35, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 6, 20, Math.PI * 0.95]} />
        <meshStandardMaterial color="#2a3344" metalness={0.65} roughness={0.35} />
      </mesh>

      {/* Front splitter */}
      <mesh castShadow position={[0, 0.04, 0.95]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.92, 0.04, 0.22]} />
        <meshStandardMaterial color="#0f141d" metalness={0.35} roughness={0.55} />
      </mesh>

      {/* Nose cone */}
      <RoundedBox args={[0.72, 0.16, 0.28]} radius={0.06} smoothness={2} position={[0, 0.16, 0.88]} castShadow>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.32} envMapIntensity={1} />
      </RoundedBox>

      {/* Headlamps */}
      <mesh position={[0.34, 0.16, 0.96]}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshStandardMaterial color="#fff7d6" emissive="#fff2b0" emissiveIntensity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[-0.34, 0.16, 0.96]}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshStandardMaterial color="#fff7d6" emissive="#fff2b0" emissiveIntensity={0.85} toneMapped={false} />
      </mesh>

      {/* Rear wing */}
      <group position={[0, 0.36, -0.9]}>
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[1.08, 0.03, 0.2]} />
          <meshStandardMaterial color="#151b26" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0.48, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.16, 0.18]} />
          <meshStandardMaterial color="#151b26" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[-0.48, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.16, 0.18]} />
          <meshStandardMaterial color="#151b26" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.06]} />
          <meshStandardMaterial color="#1b2230" metalness={0.45} roughness={0.5} />
        </mesh>
      </group>

      {/* Diffuser hint */}
      <mesh castShadow position={[0, 0.06, -0.98]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.18]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.3} roughness={0.65} />
      </mesh>

      <Wheel wheelRef={fl} x={0.54} z={0.64} />
      <Wheel wheelRef={fr} x={-0.54} z={0.64} />
      <Wheel wheelRef={rl} x={0.54} z={-0.64} />
      <Wheel wheelRef={rr} x={-0.54} z={-0.64} />
    </group>
  );
}
