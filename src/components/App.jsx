import React from "react";
import { Header } from "./Header";
import { Loader } from "./Loader";
import { PageContent } from "./PageContent";
import { ScanHud } from "./ScanHud";
import { ThreeStage } from "./three/ThreeStage";
import { usePageMotion } from "../hooks/usePageMotion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

export function App() {
  useSmoothScroll();
  usePageMotion();

  return (
    <>
      <Loader />
      <ThreeStage />
      <ScanHud />
      <Header />
      <PageContent />
    </>
  );
}
