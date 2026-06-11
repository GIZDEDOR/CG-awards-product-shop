import React, { Suspense, useEffect, useRef } from "react";
import { Environment, Html, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ASSET_PATH, products } from "../../data/products";
import { Basket } from "./Basket";
import { ProductModel } from "./ProductModel";

export function ThreeStage() {
  const sceneStateRef = useRef({
    scans: products.map(() => 0),
    final: 0,
  });

  useEffect(() => {
    const triggers = products.map((_, index) =>
      ScrollTrigger.create({
        trigger: `.product-${index + 1}`,
        start: "top top",
        end: "bottom 34%",
        scrub: true,
        onUpdate: (self) => {
          sceneStateRef.current.scans[index] = self.progress;
        },
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: ".final",
        start: "top 76%",
        end: "top 12%",
        scrub: true,
        onUpdate: (self) => {
          sceneStateRef.current.final = self.progress;
        },
      })
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  return (
    <div className="stage" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.85], fov: 46 }} shadows dpr={[1, 1.65]}>
        <color attach="background" args={["#18150f"]} />
        <ambientLight intensity={1.42} />
        <directionalLight position={[4, 6, 5]} intensity={2.05} castShadow />
        <Suspense fallback={<Html center className="canvas-loader">LOADING PRODUCT</Html>}>
          <Environment files={`${ASSET_PATH}studio_small_09_1k_low.hdr`} />
          {products.map((product, index) => (
            <ProductModel
              key={product.id}
              url={product.model}
              index={index}
              sceneStateRef={sceneStateRef}
            />
          ))}
          <Basket sceneStateRef={sceneStateRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

products.forEach((product) => useGLTF.preload(product.model));
useGLTF.preload(`${ASSET_PATH}basket_c.glb`);
