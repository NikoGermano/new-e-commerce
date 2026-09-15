import React from "react";

export const ProductCardSkeleton = ({ layout = "grid" }) => (
  <div className={`product-card product-card--${layout} is-skeleton`} aria-hidden="true">
    <div className="product-card__media skeleton" />
    <div className="product-card__body">
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--line skeleton--short" />
      <div className="skeleton skeleton--line skeleton--price" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8, layout = "grid" }) => (
  <div className={layout === "list" ? "product-list" : "product-grid"} aria-busy="true">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} layout={layout} />
    ))}
  </div>
);
