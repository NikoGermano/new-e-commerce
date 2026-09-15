import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";
import "../styles/productRow.css";

// A horizontally scrolling shelf of products, like eBay's home page rows.
const ProductRow = ({ title, seeAllTo, products, loading = false }) => {
  const track = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateArrows = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, products, loading]);

  const scrollBy = (direction) => {
    const el = track.current;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="product-row">
      <div className="section-heading">
        <h2>{title}</h2>
        {seeAllTo && (
          <Link to={seeAllTo} className="section-heading__link">
            See all <FiChevronRight aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="product-row__viewport">
        {canScroll.left && (
          <button
            className="product-row__arrow product-row__arrow--left"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
          >
            <FiChevronLeft />
          </button>
        )}
        <div className="product-row__track" ref={track} onScroll={updateArrows}>
          {loading
            ? Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {canScroll.right && (
          <button
            className="product-row__arrow product-row__arrow--right"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
          >
            <FiChevronRight />
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductRow;
