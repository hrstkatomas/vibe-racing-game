import { CIRCUIT } from "./constants";

/** Matches `Track` start/finish strip: south straight, segment across X. */
export const START_FINISH = {
  lineX: 0,
  /** Center Z of the timing strip (same formula as the mesh). */
  zCenter: -CIRCUIT.innerHalfZ - (CIRCUIT.outerHalfZ - CIRCUIT.innerHalfZ) * 0.35,
  /** Half-width along X (mesh uses plane 2.8). */
  xHalf: 1.45,
  /** Max |Z − zCenter| at the crossing point (interpolated). */
  zTol: 3.6,
  /** South straight asphalt band (world Z, negative is south of center). */
  zMin: -CIRCUIT.outerHalfZ + 0.35,
  zMax: -CIRCUIT.innerHalfZ - 0.35,
} as const;

const FORWARD_X_MIN = 0.28;

export type LapCrossResult = "none" | "count";

/**
 * Detect crossing the start/finish plane (x = 0) on the south straight, eastbound or westbound.
 * Uses segment prev→curr so fast frames do not miss the line.
 */
export function detectFinishCross(
  prev: { x: number; z: number },
  curr: { x: number; z: number },
  forwardWorldX: number,
): LapCrossResult {
  const { lineX, zCenter, zTol, zMin, zMax } = START_FINISH;
  const px = prev.x;
  const cx = curr.x;
  if (px === cx) return "none";
  if ((px < lineX && cx < lineX) || (px > lineX && cx > lineX)) return "none";

  const t = (lineX - px) / (cx - px);
  if (t <= 0 || t > 1) return "none";

  const zCross = prev.z + t * (curr.z - prev.z);
  if (zCross < zMin || zCross > zMax) return "none";
  if (Math.abs(zCross - zCenter) > zTol) return "none";

  const eastbound = cx > px;
  const westbound = cx < px;
  if (eastbound && forwardWorldX > FORWARD_X_MIN) return "count";
  if (westbound && forwardWorldX < -FORWARD_X_MIN) return "count";

  return "none";
}

export function clearOfFinishLine(x: number): boolean {
  return Math.abs(x - START_FINISH.lineX) > 2.6;
}
