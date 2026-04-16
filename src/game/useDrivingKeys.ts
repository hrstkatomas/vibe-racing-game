import { useCallback, useEffect, useRef } from "react";

function readDriving(keys: ReadonlySet<string>) {
  let forward = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) forward += 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) forward -= 1;

  let steer = 0;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) steer += 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) steer -= 1;

  return { forward, steer };
}

export function useDrivingKeys() {
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      keys.current.add(e.code);
    };
    const onUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return useCallback(() => readDriving(keys.current), []);
}
