import { Canvas } from "@react-three/fiber";
import { Sky, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { RaceNetwork } from "../hooks/useRaceNetwork";
import { CameraRig } from "./CameraRig";
import { LocalCar } from "./LocalCar";
import { RemoteCar } from "./RemoteCar";
import { Track } from "./Track";

export function RaceScene({ net }: { net: RaceNetwork }) {
  const chassisRef = useRef<THREE.Group>(null);
  const remoteIds = net.remoteIds.filter((id) => (net.playerId ? id !== net.playerId : true));

  return (
    <Canvas shadows camera={{ position: [0, 56, 22], fov: 48, near: 0.1, far: 220 }}>
      <color attach="background" args={["#070a10"]} />
      <fog attach="fog" args={["#070a10", 35, 120]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[18, 26, 10]}
        intensity={1.15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      <Sky sunPosition={[60, 24, 40]} turbidity={6} mieCoefficient={0.005} />

      <Track />

      <LocalCar
        color="#3dff9a"
        chassisRef={chassisRef}
        remoteIds={remoteIds}
        getRemote={net.getRemote}
        sendLocal={net.sendLocal}
      />
      {remoteIds.map((id) => (
        <RemoteCar key={id} id={id} net={net} />
      ))}

      <ContactShadows opacity={0.35} scale={90} blur={2.4} far={9} position={[0, 0.01, 0]} />

      <CameraRig />
    </Canvas>
  );
}
