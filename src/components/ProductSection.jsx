import React from "react";
import { ProductLabel } from "./ProductLabel";

export function ProductSection({ product, index }) {
  return (
    <section
      className={`product product-${index + 1} product-layout-${index % 2}`}
      id={index === 0 ? "products" : undefined}
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="product-side" aria-hidden="true">
        <span>{product.side}</span>
      </div>
      <div className="product-copy reveal">
        <p className="product-category mono">{product.label}</p>
        <h2 id={`product-title-${product.id}`} className="split-words">{product.title}</h2>
        <p className="body">{product.body}</p>
        <p className="body small-body">{product.note}</p>
        <blockquote>{product.quote}</blockquote>
      </div>
      <div className="product-callout reveal">
        <span className="mono">#{product.id}</span>
        <strong>{product.badge}</strong>
      </div>
      <figure className="product-photo reveal">
        <img src={product.image} alt={product.imageAlt} />
      </figure>
      <ProductLabel product={product} />
    </section>
  );
}
