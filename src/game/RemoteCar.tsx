import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RaceNetwork } from "../hooks/useRaceNetwork";
import { colorForId } from "./colorForId";
import { RCCarMesh } from "./RCCarMesh";

type Props = {
  id: string;
  net: RaceNetwork;
};

const tmpP = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();

export function RemoteCar({ id, net }: Props) {
  const group = useRef<THREE.Group>(null);
  const p = useRef(new THREE.Vector3(0, 0.35, 0));
  const q = useRef(new THREE.Quaternion());
  const speedRef = useRef(0);
  const seeded = useRef(false);
  const color = useMemo(() => colorForId(id), [id]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    const tgt = net.getRemote(id);
    if (!tgt) return;

    tmpP.set(tgt.p[0], tgt.p[1], tgt.p[2]);
    tmpQ.set(tgt.q[0], tgt.q[1], tgt.q[2], tgt.q[3]);

    if (!seeded.current) {
      p.current.copy(tmpP);
      q.current.copy(tmpQ);
      seeded.current = true;
    }

    const a = 1 - Math.pow(0.00025, dt);
    p.current.lerp(tmpP, THREE.MathUtils.clamp(a * 18, 0.05, 1));
    q.current.slerp(tmpQ, THREE.MathUtils.clamp(a * 10, 0.05, 1));

    g.position.copy(p.current);
    g.quaternion.copy(q.current);
    speedRef.current = tgt.speed;
  });

  return (
    <group ref={group}>
      <RCCarMesh color={color} speedRef={speedRef} />
    </group>
  );
}
