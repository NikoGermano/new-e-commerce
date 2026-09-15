import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useShop } from "../context/ShopContext";

const WatchButton = ({ product, className = "" }) => {
  const { isWatched, toggleWatch } = useShop();
  const watching = isWatched(product.id);

  return (
    <button
      type="button"
      className={`watch-btn ${watching ? "is-watching" : ""} ${className}`}
      aria-pressed={watching}
      aria-label={watching ? "Remove from watchlist" : "Add to watchlist"}
      onClick={() => toggleWatch(product)}
    >
      {watching ? <AiFillHeart /> : <AiOutlineHeart />}
    </button>
  );
};

export default WatchButton;
