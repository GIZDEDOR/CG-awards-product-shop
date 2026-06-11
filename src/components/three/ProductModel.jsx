import React, { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { smooth } from "../../utils/math";
import { FittedModel } from "./FittedModel";
import { useFittedModel } from "./useFittedModel";

function getScannerTarget(index, viewport, isMobile) {
  const desktop = [
    [0, -viewport.height * 0.16],
    [viewport.width * 0.24, -viewport.height * 0.08],
    [viewport.width * 0.08, -viewport.height * 0.18],
    [-viewport.width * 0.22, -viewport.height * 0.02],
  ];
  const mobile = [
    [0, -viewport.height * 0.1],
    [viewport.width * 0.1, -viewport.height * 0.08],
    [-viewport.width * 0.04, -viewport.height * 0.12],
    [-viewport.width * 0.08, -viewport.height * 0.04],
  ];
  const [x, y] = (isMobile ? mobile : desktop)[index] || [0, 0];
  return new THREE.Vector3(x, y, 1.22);
}

export function ProductModel({ url, index, sceneStateRef }) {
  const group = useRef();
  const viewport = useThree((state) => state.viewport);
  const { clone, fit } = useFittedModel(url);
  const materials = useMemo(() => {
    const list = [];
    clone.traverse((node) => {
      if (node.isMesh && node.material) {
        list.push(node.material);
      }
    });
    return list;
  }, [clone]);
  const scanColor = useMemo(() => new THREE.Color("#d84a31"), []);
  const baseColor = useMemo(() => new THREE.Color("#ebe6d8"), []);
  const start = useMemo(() => {
    const points = [
      [0.05, -0.88, 1.02],
      [-1.18, 0.28, 1.04],
      [0.12, 0.72, 1.08],
      [1.12, 0.2, 1.02],
    ];
    return new THREE.Vector3(...points[index % points.length]);
  }, [index]);

  const basePose = useMemo(() => {
    const poses = [
      [Math.PI / 2, 0.12, Math.PI / 2],
      [0.24, 0.5, -0.08],
      [0.2, 0.36, Math.PI / 2],
      [0.2, -0.35, -0.08],
    ];
    return poses[index] || [0, 0, 0];
  }, [index]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const { scans, final } = sceneStateRef.current;
    const scanProgress = scans[index] || 0;
    const finalProgress = final || 0;
    const activeIndex = scans.findIndex((progress) => progress > 0.05 && progress < 0.98);
    const activeScanProgress = activeIndex === -1 ? 0 : scans[activeIndex] || 0;
    const isActiveScan = activeIndex === index;
    const pushedByActiveScan = activeIndex !== -1 && activeIndex !== index && finalProgress < 0.02;
    const t = clock.elapsedTime;
    const isMobile = viewport.width < 5.5;
    const intro = smooth(0, 1.7, t);
    const displayPose = smooth(1.55, 3.2, t);
    const scannerAppear = smooth(0.48, 0.62, scanProgress);
    const scanSpin = smooth(0.28, 0.82, scanProgress);
    const settleInCard = smooth(0.62, 0.84, scanProgress);
    const exitScan = smooth(0.78, 0.98, scanProgress);
    const activeTravel = smooth(0.12, 0.82, scanProgress);
    const hasScanned = scanProgress > 0.98 && finalProgress < 0.02;
    const liftOthers = smooth(0.02, 0.64, activeScanProgress);
    const fadeOthers = smooth(0.34, 0.82, activeScanProgress);

    const basketScaleBoost = [0.95, 1.08, 0.82, 0.92][index] || 1;
    const startScale = isMobile ? 1.42 : 2.18;
    const scanScale = isMobile ? 1.72 : 2.52;
    const exitScale = isMobile ? 0.04 : 0.06;
    const basketScale = (isMobile ? 0.66 : 0.92) * basketScaleBoost;
    const spreadX = isMobile ? 0.95 : viewport.width * 0.16;
    const spreadY = isMobile ? 0.62 : viewport.height * 0.18;
    const startPosition = new THREE.Vector3(start.x * spreadX, start.y * spreadY, start.z);
    startPosition.y -= (1 - intro) * (isMobile ? 3.2 : 3.9);

    const scanTarget = getScannerTarget(index, viewport, isMobile);
    const focusTarget = new THREE.Vector3(0, isMobile ? -0.04 : -0.05, 1.18);
    const activeDropTarget = scanTarget.clone();
    activeDropTarget.y += isMobile ? 0.8 : viewport.height * 0.38;
    activeDropTarget.z = 1.12;
    const pushedUpTarget = new THREE.Vector3(
      startPosition.x * 0.92,
      startPosition.y + (isMobile ? 2.45 : viewport.height * 0.9),
      startPosition.z - 0.55
    );
    const exitTarget = scanTarget.clone();
    exitTarget.x += (index % 2 === 0 ? -1 : 1) * (isMobile ? 1.25 : viewport.width * 0.42);
    exitTarget.y += isMobile ? -0.8 : -viewport.height * 0.34;
    exitTarget.z = 0.24;
    const basketTarget = new THREE.Vector3(
      (index - 1.5) * (isMobile ? 0.18 : 0.34),
      isMobile ? -0.78 : -0.68,
      0.64 + index * 0.04
    );

    const activePosition = startPosition
      .clone()
      .lerp(focusTarget, isActiveScan ? smooth(0.02, 0.12, scanProgress) : 0)
      .lerp(activeDropTarget, smooth(0.12, 0.28, scanProgress))
      .lerp(scanTarget, scannerAppear)
      .lerp(exitTarget, exitScan)
      .lerp(basketTarget, finalProgress);
    const position = pushedByActiveScan
      ? startPosition.clone().lerp(pushedUpTarget, liftOthers)
      : activePosition;

    const floatY = Math.sin(t * 0.9 + index * 0.7) * 0.08 * (1 - activeTravel) * (pushedByActiveScan || hasScanned ? 0.16 : 1);
    group.current.position.set(position.x, position.y + floatY, position.z);

    const redScan = smooth(0.62, 0.78, scanProgress) * (1 - exitScan);
    const parkPose = finalProgress;
    const scanPoseX = 0.16 + index * 0.04;
    const scanPoseZ = index % 2 === 0 ? 0.08 : -0.08;
    const restingX = THREE.MathUtils.lerp(basePose[0], basePose[0] + 0.08, displayPose);
    const restingY = THREE.MathUtils.lerp(basePose[1], basePose[1] + 0.18, displayPose);
    const restingZ = THREE.MathUtils.lerp(basePose[2], basePose[2] - 0.06, displayPose);
    const scrollTilt = scanProgress * Math.PI * 0.15;
    const travelRotationX = restingX + scrollTilt;
    const travelRotationZ = restingZ + scannerAppear * scanPoseZ;
    const scrollSpin = scanProgress * 0.9 + scanSpin * Math.PI * 2.35;
    const settledX = THREE.MathUtils.lerp(travelRotationX, scanPoseX, settleInCard);
    const settledZ = THREE.MathUtils.lerp(travelRotationZ, scanPoseZ, settleInCard);
    group.current.rotation.x =
      THREE.MathUtils.lerp(settledX, -0.16 + index * 0.06, parkPose) + finalProgress * 0.55;
    group.current.rotation.z =
      THREE.MathUtils.lerp(settledZ, (index - 1.5) * 0.12, parkPose) +
      finalProgress * (index - 1.5) * 0.28;
    group.current.rotation.y =
      restingY +
      t * 0.36 +
      scrollSpin +
      exitScan * Math.PI * 0.45 +
      parkPose * (index - 1.5) * 0.18;

    const scaleBeforeExit = THREE.MathUtils.lerp(startScale, scanScale, scannerAppear);
    const scaleAfterExit = THREE.MathUtils.lerp(scaleBeforeExit, exitScale, exitScan);
    const pushedScale = THREE.MathUtils.lerp(startScale, 0.001, fadeOthers);
    const activeScanScale = hasScanned && finalProgress < 0.02 ? 0.001 : scaleAfterExit;
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(pushedByActiveScan ? pushedScale : activeScanScale, basketScale, finalProgress)
    );

    materials.forEach((material) => {
      material.color?.lerpColors?.(baseColor, scanColor, redScan);
      material.emissive?.setRGB(redScan * 0.45, redScan * 0.04, redScan * 0.04);
    });
  });

  return (
    <Float speed={1.35 + index * 0.14} floatIntensity={0.38} rotationIntensity={0.2}>
      <group ref={group}>
        <FittedModel object={clone} fit={fit} />
      </group>
    </Float>
  );
}
