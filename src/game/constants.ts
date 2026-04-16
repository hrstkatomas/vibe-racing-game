/** Half-size of drivable asphalt (car center clamp). */
export const ARENA_HALF = 22;

export const CAR = {
  maxSpeed: 16,
  accel: 28,
  brake: 38,
  drag: 1.35,
  turn: 2.85,
  minTurnSpeed: 0.35,
};

/** XZ hull: min distance between car centers so bodies do not overlap. */
export const CAR_BODY = {
  minCenterDistance: 1.95,
  solvePasses: 4,
  /** Scale `speed` after a correction step (head-on cushion). */
  hitSpeedDamp: 0.88,
};
