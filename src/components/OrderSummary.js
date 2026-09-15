import React from "react";
import { FREE_SHIPPING_MIN, formatPrice, shippingFor } from "../utils/catalog";

const OrderSummary = ({ itemCount, subtotal, children, showFreeShippingHint = false }) => {
  const shipping = shippingFor(subtotal);
  const remaining = FREE_SHIPPING_MIN - subtotal;

  return (
    <div className="order-summary">
      <dl>
        <div>
          <dt>
            Items ({itemCount})
          </dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="order-summary__total">
          <dt>Total</dt>
          <dd>{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>
      {showFreeShippingHint && remaining > 0 && (
        <p className="order-summary__hint">
          Add <strong>{formatPrice(remaining)}</strong> more to get free shipping.
        </p>
      )}
      {children}
    </div>
  );
};

export default OrderSummary;
