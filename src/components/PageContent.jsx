import React from "react";
import { ASSET_PATH, products, studioEmail, studioName } from "../data/products";
import { ProductSection } from "./ProductSection";

const productIndex = products.map((product) => `${product.ref} ${product.label}`);

export function PageContent() {
  return (
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media reveal">
          <img
            src={`${ASSET_PATH}grupo_encajaregistradora.jpg`}
            alt="A cinematic retail counter arranged with branded studio objects"
          />
        </div>
        <div className="hero-center reveal-text">
          <p className="eyebrow">Studio products</p>
          <h1 id="hero-title">
            <span>{studioName}</span>
            <span className="split-words">Brand worlds</span>
          </h1>
          <p>
            Cinematic identity, motion and web systems for brands that need a world, not a template.
          </p>
        </div>
        <div className="hero-copy mono reveal">
          <p>Identity</p>
          <p>Motion</p>
          <p>Web</p>
        </div>
      </section>

      <section className="manifesto" id="info">
        <div className="product-index mono reveal" aria-label="Studio product index">
          {productIndex.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="intro-grid">
          <h2 className="intro-title reveal-text split-words">
            <span>Every touchpoint should feel directed.</span>
          </h2>
          <p className="intro-lede reveal">
            We build brand systems as scenes: clear rhythm, controlled detail and enough tension to stay memorable.
          </p>
          <div className="intro-image reveal">
            <img src={`${ASSET_PATH}manos_productos.jpg`} alt="Hands holding several packaged studio objects" />
          </div>
        </div>

        <div className="manifesto-grid">
          <p className="manifesto-mark mono reveal">{studioName} works in compact product sets</p>
          <h2 className="reveal-text split-words">Four products cover the full launch arc.</h2>
          <div className="manifesto-copy">
            <p className="reveal">
              Strategy becomes a brand world. That world becomes a visual system. The system becomes a site, then a campaign object people can remember.
            </p>
            <p className="reveal">
              The page behaves like a retail scan because the offer is tangible: pick a product, examine the label, move through the sequence.
            </p>
          </div>
        </div>
      </section>

      {products.map((product, index) => (
        <ProductSection key={product.id} product={product} index={index} />
      ))}

      <section className="scanner-zone" aria-labelledby="scanner-title">
        <div className="scanner-copy reveal">
          <span className="mono">Purchase logic</span>
          <h2 id="scanner-title" className="split-words">One brief, one custom basket.</h2>
          <p>
            There are no fixed packages. Each product frames a conversation, then the final scope is built around the brand, team and launch pressure.
          </p>
        </div>
        <div className="scanner">
          <div className="scan-line" />
          <img src={`${ASSET_PATH}barcode.svg`} alt="" />
          <span className="mono">Scan product</span>
        </div>
      </section>

      <section className="final" id="contact">
        <div className="final-media">
          <img
            src={`${ASSET_PATH}carrito_productos.jpg`}
            alt="A cart arranged with branded studio products"
          />
        </div>
        <div className="final-copy reveal">
          <span className="mono">Inquire</span>
          <h2 className="split-words">Bring a sharper brief to the counter.</h2>
          <p>
            We work with teams that want a distinct launch system, a memorable site or a brand world with room to move.
          </p>
          <p>General inquiries and new business:</p>
          <a href={`mailto:${studioEmail}`}>{studioEmail}</a>
        </div>
        <div className="receipt-final mono">
          <strong>{studioName}</strong>
          <span>--------------------</span>
          <span>TOTAL:</span>
          <b>CUSTOM BRIEF</b>
          <span>Thanks for your visit.</span>
          <img src={`${ASSET_PATH}barcode.svg`} alt="" />
          <a href="#top">Back to top</a>
        </div>
      </section>
    </main>
  );
}
