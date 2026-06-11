import React from "react";
import { ASSET_PATH, products, studioName } from "../data/products";

export function ScanHud() {
  return (
    <aside className="scan-hud" aria-hidden="true">
      <div className="scan-frame">
        <div className="scan-line" />
        <div className="scan-number mono">
          {products.map((product, index) => (
            <span className={`scan-number-item scan-number-${index}`} key={product.id}>
              #{String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <span className="scan-caption">DIRECTED BRAND SYSTEM</span>
        <img className="scan-barcode" src={`${ASSET_PATH}barcode.svg`} alt="" />
        <div className="scan-facts mono">
          <span>FOR CONTEMPORARY BRANDS</span>
          <span>IDENTITY, MOTION, WEB</span>
          <span>STUDIO PRODUCTS</span>
        </div>
      </div>
      <div className="receipt-printer mono">
        <strong>{studioName}</strong>
        <span>--------------------</span>
        {products.map((product, index) => (
          <span className={`receipt-line receipt-line-${index}`} key={product.id}>
            {product.label} x1&nbsp;&nbsp; {product.ref}
          </span>
        ))}
        <span>--------------------</span>
        <b>TOTAL: CUSTOM BRIEF</b>
        <img src={`${ASSET_PATH}barcode.svg`} alt="" />
      </div>
    </aside>
  );
}
