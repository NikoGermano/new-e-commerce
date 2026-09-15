import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { formatPrice } from "../utils/catalog";
import "../styles/checkout.css";

const OrderConfirmation = () => {
  const order = useLocation().state?.order;
  if (!order) return <Navigate to="/" replace />;

  const firstName = order.name.split(" ")[0];

  return (
    <div className="container page">
      <div className="panel confirmation">
        <FiCheckCircle className="confirmation__icon" aria-hidden="true" />
        <h1 className="confirmation__title">Thanks, {firstName}! Your order is confirmed.</h1>
        <p>
          We'd send a confirmation to <strong>{order.email}</strong> if this were a real store.
        </p>

        <dl className="confirmation__facts">
          <div>
            <dt>Order number</dt>
            <dd>{order.number}</dd>
          </div>
          <div>
            <dt>Estimated delivery</dt>
            <dd>{order.delivery}</dd>
          </div>
          <div>
            <dt>Order total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <ul className="checkout__items">
          {order.items.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <Link to={`/item/${item.id}`} className="checkout__item-title">
                  {item.title}
                </Link>
                <p className="checkout__item-meta">Qty {item.qty}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/" className="btn btn--primary btn--lg">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
