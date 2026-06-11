import React from "react";
import { ASSET_PATH, products, studioName } from "../data/products";
import { playSound } from "../utils/sound";

export function Loader() {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date());

  return (
    <div className="loader" aria-label="Loading studio products">
      <div className="loader-receipt mono">
        <strong>{studioName}</strong>
        <span>{date}</span>
        <span>--------------------</span>
        <b>STUDIO PRODUCTS</b>
        {products.map((product) => (
          <span key={product.id}>{product.label} x1</span>
        ))}
        <span>TOTAL: CUSTOM BRIEF</span>
        <span>********************</span>
        <img src={`${ASSET_PATH}barcode.svg`} alt="" />
        <button onClick={() => playSound("print1.2.mp3")}>Enter</button>
      </div>
    </div>
  );
}
