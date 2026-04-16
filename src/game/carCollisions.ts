import * as THREE from "three";
import type { RemoteTarget } from "../hooks/useRaceNetwork";
import { CAR_BODY } from "./constants";

const a = new THREE.Vector2();
const b = new THREE.Vector2();
const d = new THREE.Vector2();

/**
 * Pushes `position` (XZ) out of overlapping remote hulls. Returns true if any overlap was resolved.
 */
export function resolveLocalAgainstRemotes(
  position: THREE.Vector3,
  remoteIds: readonly string[],
  getRemote: (id: string) => RemoteTarget | undefined,
): boolean {
  let touched = false;
  const minD = CAR_BODY.minCenterDistance;

  for (let pass = 0; pass < CAR_BODY.solvePasses; pass++) {
    for (const id of remoteIds) {
      const r = getRemote(id);
      if (!r) continue;

      a.set(position.x, position.z);
      b.set(r.p[0], r.p[2]);
      d.copy(a).sub(b);

      let dist = d.length();
      if (dist < 1e-5) {
        d.set(1, 0);
        dist = 1e-5;
      }

      if (dist < minD) {
        const n = (minD - dist) / dist;
        position.x += d.x * n;
        position.z += d.y * n;
        touched = true;
      }
    }
  }

  return touched;
}
