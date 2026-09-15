import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useShop } from "../context/ShopContext";
import useAddToCart from "../hooks/useAddToCart";
import { formatPrice } from "../utils/catalog";
import StatusMessage from "../components/StatusMessage";
import "../styles/cart.css";

const Watchlist = () => {
  const { watchlist, toggleWatch } = useShop();
  const addToCart = useAddToCart();

  return (
    <div className="container page">
      <h1 className="page-title">
        Watchlist {watchlist.length > 0 && <span className="page-title__count">({watchlist.length})</span>}
      </h1>

      {watchlist.length === 0 ? (
        <StatusMessage
          icon={<FiHeart />}
          title="Your watchlist is empty"
          actions={
            <Link to="/" className="btn btn--primary">
              Discover items
            </Link>
          }
        >
          Tap the heart on any item to keep track of it here.
        </StatusMessage>
      ) : (
        <ul className="cart__items watchlist">
          {watchlist.map((item) => (
            <li key={item.id} className="cart-line">
              <Link to={`/item/${item.id}`} className="cart-line__image" tabIndex={-1} aria-hidden="true">
                <img src={item.image} alt="" />
              </Link>
              <div className="cart-line__info">
                <Link to={`/item/${item.id}`} className="cart-line__title">
                  {item.title}
                </Link>
                <p className="cart-line__meta">Brand New</p>
                <div className="cart-line__controls">
                  <button className="link-btn" onClick={() => toggleWatch(item)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-line__price">
                <strong>{formatPrice(item.price)}</strong>
                <button className="btn btn--secondary btn--sm" onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
