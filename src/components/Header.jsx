import React from "react";
import { studioEmail, studioName } from "../data/products";

export function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Back to top">{studioName}</a>
      <nav aria-label="Primary navigation">
        <a href="#info">Method</a>
        <a href="#products">Products</a>
        <a href="#contact">Inquire</a>
      </nav>
      <a href={`mailto:${studioEmail}`} className="header-mail">
        {studioEmail}
      </a>
    </header>
  );
}
