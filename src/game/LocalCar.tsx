import { type MutableRefObject, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAR, CAR_BODY, clampToCircuit, randomTrackPosition } from "./constants";
import { resolveLocalAgainstRemotes } from "./carCollisions";
import { RCCarMesh } from "./RCCarMesh";
import { useDrivingKeys } from "./useDrivingKeys";
import type { RemoteTarget } from "../hooks/useRaceNetwork";

type Props = {
  color: string;
  chassisRef: MutableRefObject<THREE.Group | null>;
  remoteIds: readonly string[];
  getRemote: (id: string) => RemoteTarget | undefined;
  sendLocal: (sample: {
    p: [number, number, number];
    q: [number, number, number, number];
    speed: number;
  }) => void;
};

const euler = new THREE.Euler(0, 0, 0, "YXZ");
const v = new THREE.Vector3();
const q = new THREE.Quaternion();

export function LocalCar({ color, chassisRef, remoteIds, getRemote, sendLocal }: Props) {
  const read = useDrivingKeys();
  const speedRef = useRef(0);
  const speed = useRef(0);

  useLayoutEffect(() => {
    const g = chassisRef.current;
    if (!g) return;
    const sp = randomTrackPosition();
    g.position.set(sp.x, 0.35, sp.z);
    g.quaternion.identity();
  }, [chassisRef]);

  useFrame((_, dt) => {
    const g = chassisRef.current;
    if (!g) return;

    const { forward, steer } = read();
    const s = speed.current;

    const turnFactor = THREE.MathUtils.clamp(Math.abs(s) / CAR.maxSpeed, CAR.minTurnSpeed, 1);
    euler.setFromQuaternion(g.quaternion, "YXZ");
    euler.y += (steer * CAR.turn * turnFactor) * dt;
    g.quaternion.setFromEuler(euler);

    const accel =
      forward > 0 ? forward * CAR.accel : forward < 0 ? forward * CAR.brake : -Math.sign(s || 0) * CAR.drag;

    let next = s + accel * dt;
    next = THREE.MathUtils.clamp(next, -CAR.maxSpeed * 0.35, CAR.maxSpeed);
    if (Math.abs(next) < 0.05 && forward === 0) next = 0;
    speed.current = next;
    speedRef.current = next;

    v.set(0, 0, -1).applyQuaternion(g.quaternion).multiplyScalar(next * dt);
    g.position.add(v);

    if (resolveLocalAgainstRemotes(g.position, remoteIds, getRemote)) {
      const damp = CAR_BODY.hitSpeedDamp;
      speed.current *= damp;
      speedRef.current = speed.current;
    }

    const c = clampToCircuit(g.position.x, g.position.z);
    g.position.x = c.x;
    g.position.z = c.z;

    q.copy(g.quaternion);
    sendLocal({
      p: g.position.toArray() as [number, number, number],
      q: q.toArray() as [number, number, number, number],
      speed: speed.current,
    });
  });

  return (
    <group ref={chassisRef}>
      <RCCarMesh color={color} speedRef={speedRef} />
    </group>
  );
}
