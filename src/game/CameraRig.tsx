import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Fixed broadcast-style view above the small circuit. */
const POSITION = new THREE.Vector3(0, 54, 36);

export function CameraRig() {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.copy(POSITION);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 48;
      camera.near = 0.1;
      camera.far = 220;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
}
