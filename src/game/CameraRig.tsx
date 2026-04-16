import { type MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  target: MutableRefObject<THREE.Group | null>;
};

const camPos = new THREE.Vector3();
const look = new THREE.Vector3();
const back = new THREE.Vector3();

export function CameraRig({ target }: Props) {
  const { camera } = useThree();
  const smooth = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const t = target.current;
    if (!t) return;

    back.set(0, 0, 1).applyQuaternion(t.quaternion).normalize();
    camPos.copy(t.position).add(back.multiplyScalar(10)).add(new THREE.Vector3(0, 4.2, 0));

    const a = 1 - Math.pow(0.0004, dt);
    smooth.current.lerp(camPos, THREE.MathUtils.clamp(a * 8, 0.05, 1));
    camera.position.copy(smooth.current);

    look.copy(t.position).add(new THREE.Vector3(0, 1.1, 0));
    camera.lookAt(look);
  });

  return null;
}
