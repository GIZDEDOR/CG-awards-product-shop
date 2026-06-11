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

  useFrame(() => {
    if (!group.current) return;

    const finalProgress = sceneStateRef.current.final || 0;
    const isMobile = viewport.width < 5.5;
    const settle = smooth(0.08, 0.86, finalProgress);
    group.current.visible = finalProgress > 0.01;
    group.current.position.set(
      0,
      THREE.MathUtils.lerp(isMobile ? 0.15 : 0.25, isMobile ? -0.95 : -0.74, settle),
      THREE.MathUtils.lerp(isMobile ? 2.1 : 2.55, 0.24, settle)
    );
    group.current.rotation.set(
      THREE.MathUtils.lerp(Math.PI / 2, -0.36, settle),
      THREE.MathUtils.lerp(0, Math.PI + 0.22, settle),
      THREE.MathUtils.lerp(0, -0.24, settle)
    );
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(isMobile ? 3.2 : 4.3, isMobile ? 2.3 : 3.15, settle) * finalProgress
    );
  });

  return (
    <group ref={group}>
      <FittedModel object={clone} fit={fit} />
    </group>
  );
}
