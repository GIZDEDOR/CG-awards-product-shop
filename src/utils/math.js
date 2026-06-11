import * as THREE from "three";

export const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);

export const smooth = (edge0, edge1, value) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};
