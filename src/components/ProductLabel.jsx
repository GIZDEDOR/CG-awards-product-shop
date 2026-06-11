import React from "react";
import { ASSET_PATH } from "../data/products";
import { playSound } from "../utils/sound";

const rows = [
  ["Tempo", "Measured"],
  ["Voice", "Directed"],
  ["Motion", "Purposeful"],
  ["Texture", "Tactile"],
  ["Output", "Launch ready"],
];

export function ProductLabel({ product }) {
  return (
    <article className="label reveal">
      <div className="label-top">
        <span>#{product.id}</span>
        <span>{product.ref}</span>
      </div>
      <h3>{product.kicker}</h3>
      <img src={`${ASSET_PATH}barcode.svg`} alt="" className="barcode" />
      <div className="facts mono">
        <span>Made for</span>
        <strong>{product.productFor}</strong>
        {rows.map(([name, value]) => (
          <React.Fragment key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
          </React.Fragment>
        ))}
      </div>
      <button onClick={() => playSound("beep.mp3")}>Scan</button>
      <p>Includes: {product.ingredients.join(", ")}.</p>
      <p>* {product.footnote}</p>
      <b className="label-footer mono">Studio products for contemporary brands</b>
    </article>
  );
}
