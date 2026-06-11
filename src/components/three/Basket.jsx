import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ASSET_PATH } from "../../data/products";
import { smooth } from "../../utils/math";
import { FittedModel } from "./FittedModel";
import { useFittedModel } from "./useFittedModel";

export function Basket({ sceneStateRef }) {
  const group = useRef();
  const viewport = useThree((state) => state.viewport);
  const { clone, fit } = useFittedModel(`${ASSET_PATH}basket_c.glb`);

  useFrame((_, delta) => {
    if (!group.current) return;

    const finalProgress = sceneStateRef.current.final || 0;
    const isMobile = viewport.width < 5.5;
    const settle = smooth(0.08, 0.86, finalProgress);
    group.current.visible = finalProgress > 0.01;
    const targetY =
      THREE.MathUtils.lerp(isMobile ? 0.15 : 0.25, isMobile ? -0.95 : -0.74, settle);
    const targetZ = THREE.MathUtils.lerp(isMobile ? 2.1 : 2.55, 0.24, settle);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0, 5.2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 5.2, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 5.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      THREE.MathUtils.lerp(Math.PI / 2, -0.36, settle),
      5.2,
      delta
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      THREE.MathUtils.lerp(0, Math.PI + 0.22, settle),
      5.2,
      delta
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      THREE.MathUtils.lerp(0, -0.24, settle),
      5.2,
      delta
    );
    const scale = THREE.MathUtils.damp(
      group.current.scale.x,
      THREE.MathUtils.lerp(isMobile ? 3.2 : 4.3, isMobile ? 2.3 : 3.15, settle) * finalProgress,
      5.8,
      delta
    );
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <FittedModel object={clone} fit={fit} />
    </group>
  );
}
