import React from "react";

export function FittedModel({ object, fit }) {
  return (
    <group scale={fit.scale}>
      <primitive object={object} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
    </group>
  );
}
