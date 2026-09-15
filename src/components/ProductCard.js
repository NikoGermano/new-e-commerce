import React from "react";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_MIN, categoryByApiName, formatPrice } from "../utils/catalog";
import Rating from "./Rating";
import WatchButton from "./WatchButton";
import "../styles/productCard.css";

const ProductCard = ({ product, layout = "grid" }) => {
  const href = `/item/${product.id}`;

  return (
    <article className={`product-card product-card--${layout}`}>
      <div className="product-card__media">
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" loading="lazy" />
        </Link>
        <WatchButton product={product} className="product-card__watch" />
      </div>
      <div className="product-card__body">
        <Link to={href} className="product-card__title">
          {product.title}
        </Link>
        <p className="product-card__meta">
          Brand New
          {layout === "list" && ` · ${categoryByApiName(product.category)?.label ?? ""}`}
        </p>
        {product.rating && <Rating rate={product.rating.rate} count={product.rating.count} />}
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <p className="product-card__shipping">
          {product.price >= FREE_SHIPPING_MIN ? "Free shipping" : "Buy It Now"}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
