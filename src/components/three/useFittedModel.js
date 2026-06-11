import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function useFittedModel(url) {
  const { scene } = useGLTF(url, "/draco/");
  const clone = useMemo(() => scene.clone(true), [scene]);
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return {
      center,
      scale: 1 / maxDim,
    };
  }, [clone]);

  useEffect(() => {
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material = node.material.clone();
        node.material.roughness = Math.min(0.62, node.material.roughness + 0.12);
        node.material.metalness = Math.max(0.08, node.material.metalness * 0.6);
      }
    });
  }, [clone]);

  return { clone, fit };
}
