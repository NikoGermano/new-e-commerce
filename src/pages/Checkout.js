import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiShield } from "react-icons/fi";
import { useShop } from "../context/ShopContext";
import { deliveryWindow, formatPrice, shippingFor } from "../utils/catalog";
import Breadcrumbs from "../components/Breadcrumbs";
import OrderSummary from "../components/OrderSummary";
import "../styles/checkout.css";

const FIELDS = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Street address", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", autoComplete: "address-level1" },
  { name: "zip", label: "ZIP code", autoComplete: "postal-code", inputMode: "numeric" },
];

function validate(values) {
  const errors = {};
  FIELDS.forEach(({ name, label }) => {
    if (!values[name].trim()) errors[name] = `Enter your ${label.toLowerCase()}`;
  });
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email";
  if (values.zip && !/^\d{5}(-\d{4})?$/.test(values.zip)) errors.zip = "Enter a 5-digit ZIP code";
  return errors;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartCount, subtotal, clearCart } = useShop();
  const [values, setValues] = useState(() => Object.fromEntries(FIELDS.map((f) => [f.name, ""])));
  const [errors, setErrors] = useState({});

  if (cart.length === 0) return <Navigate to="/cart" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = FIELDS.find((f) => found[f.name]);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid.name}`)?.focus();
      return;
    }
    const order = {
      number: `ES-${Date.now().toString().slice(-8)}`,
      name: values.fullName.trim(),
      email: values.email.trim(),
      items: cart,
      total: subtotal + shippingFor(subtotal),
      delivery: deliveryWindow(),
    };
    navigate("/order-confirmation", { replace: true, state: { order } });
    clearCart();
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="page-title">Checkout</h1>

      <form className="checkout" onSubmit={onSubmit} noValidate>
        <div className="checkout__main">
          <section className="panel">
            <h2 className="panel__title">Ship to</h2>
            <div className="form-grid">
              {FIELDS.map((f) => (
                <div key={f.name} className={`field ${f.wide ? "field--wide" : ""}`}>
                  <label htmlFor={`checkout-${f.name}`}>{f.label}</label>
                  <input
                    id={`checkout-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    inputMode={f.inputMode}
                    value={values[f.name]}
                    onChange={onChange}
                    aria-invalid={Boolean(errors[f.name])}
                    aria-describedby={errors[f.name] ? `checkout-${f.name}-error` : undefined}
                  />
                  {errors[f.name] && (
                    <p id={`checkout-${f.name}-error`} className="field__error">
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">Review items and shipping</h2>
            <ul className="checkout__items">
              {cart.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <p className="checkout__item-title">{item.title}</p>
                    <p className="checkout__item-meta">
                      {formatPrice(item.price)} · Qty {item.qty}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="checkout__delivery">Estimated delivery: {deliveryWindow()}</p>
          </section>
        </div>

        <aside className="checkout__summary">
          <OrderSummary itemCount={cartCount} subtotal={subtotal}>
            <button type="submit" className="btn btn--primary btn--lg btn--block">
              Place order
            </button>
            <p className="checkout__notice">
              <FiShield aria-hidden="true" /> This is a demo store. No payment is taken and nothing
              will ship.
            </p>
          </OrderSummary>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
