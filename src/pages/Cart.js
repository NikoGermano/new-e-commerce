import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useShop } from "../context/ShopContext";
import { formatPrice } from "../utils/catalog";
import QuantitySelect from "../components/QuantitySelect";
import OrderSummary from "../components/OrderSummary";
import StatusMessage from "../components/StatusMessage";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartCount, subtotal, setQuantity, removeFromCart, saveForLater, watchlist } = useShop();

  if (cart.length === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Shopping cart</h1>
        <StatusMessage
          icon={<FiShoppingCart />}
          title="You don't have any items in your cart"
          actions={
            <>
              <Link to="/" className="btn btn--primary">
                Start shopping
              </Link>
              {watchlist.length > 0 && (
                <Link to="/watchlist" className="btn btn--secondary">
                  View your watchlist ({watchlist.length})
                </Link>
              )}
            </>
          }
        >
          Items you add are saved on this device, so they'll still be here when you come back.
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Shopping cart</h1>
      <div className="cart">
        <ul className="cart__items">
          {cart.map((item) => (
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
                  <QuantitySelect
                    id={`qty-${item.id}`}
                    label="Qty"
                    value={item.qty}
                    onChange={(qty) => setQuantity(item.id, qty)}
                  />
                  <button className="link-btn" onClick={() => saveForLater(item.id)}>
                    Save for later
                  </button>
                  <button className="link-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-line__price">
                <strong>{formatPrice(item.price * item.qty)}</strong>
                {item.qty > 1 && <span>{formatPrice(item.price)} each</span>}
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart__summary">
          <OrderSummary itemCount={cartCount} subtotal={subtotal} showFreeShippingHint>
            <button className="btn btn--primary btn--lg btn--block" onClick={() => navigate("/checkout")}>
              Go to checkout
            </button>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
