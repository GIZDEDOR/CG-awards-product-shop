import React from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { App } from "./components/App";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")).render(<App />);
