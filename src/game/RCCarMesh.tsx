import { type MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  color: string;
  speedRef: MutableRefObject<number>;
};

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

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[1.05, 0.32, 1.85]} />
        <meshStandardMaterial color={color} metalness={0.22} roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 0.52, -0.15]}>
        <boxGeometry args={[0.75, 0.35, 0.85]} />
        <meshStandardMaterial color="#0d1117" metalness={0.35} roughness={0.35} />
      </mesh>

      <group ref={fl} position={[0.52, 0.16, 0.62]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 14]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={fr} position={[-0.52, 0.16, 0.62]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 14]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rl} position={[0.52, 0.16, -0.62]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 14]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rr} position={[-0.52, 0.16, -0.62]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 14]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
