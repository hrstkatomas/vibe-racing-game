import * as THREE from "three";

/** Axis-aligned rectangular loop: infield grass inside inner box; asphalt in the frame between inner and outer. */
export const CIRCUIT = {
  innerHalfX: 8,
  innerHalfZ: 12,
  outerHalfX: 15,
  outerHalfZ: 24,
} as const;

export const CAR = {
  maxSpeed: 32,
  accel: 56,
  brake: 76,
  drag: 2.7,
  turn: 5.7,
  minTurnSpeed: 0.35,
};

/** XZ hull: min distance between car centers so bodies do not overlap. */
export const CAR_BODY = {
  minCenterDistance: 1.95,
  solvePasses: 4,
  /** Scale `speed` after a correction step (head-on cushion). */
  hitSpeedDamp: 0.88,
};

const EPS = 0.12;

/** Keep car on asphalt: inside outer bounds, outside inner infield. */
export function clampToCircuit(x: number, z: number): { x: number; z: number } {
  const { innerHalfX: ix, innerHalfZ: iz, outerHalfX: ox, outerHalfZ: oz } = CIRCUIT;
  let nx = THREE.MathUtils.clamp(x, -ox, ox);
  let nz = THREE.MathUtils.clamp(z, -oz, oz);

  if (Math.abs(nx) < ix && Math.abs(nz) < iz) {
    const dx = ix - Math.abs(nx);
    const dz = iz - Math.abs(nz);
    const sx = nx === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(nx);
    const sz = nz === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(nz);
    if (dx < dz) nx = sx * (ix + EPS);
    else nz = sz * (iz + EPS);
  }

  return { x: nx, z: nz };
}

/** Random XZ on the track surface (for spawn). */
export function randomTrackPosition(): { x: number; z: number } {
  const { innerHalfX: ix, innerHalfZ: iz, outerHalfX: ox, outerHalfZ: oz } = CIRCUIT;
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() * 2 - 1) * ox;
    const z = (Math.random() * 2 - 1) * oz;
    if (Math.abs(x) >= ix || Math.abs(z) >= iz) return { x, z };
  }
  return { x: ox * 0.82, z: 0 };
}
