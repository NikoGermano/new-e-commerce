import React from "react";
import { MAX_QTY } from "../utils/catalog";

const QuantitySelect = ({ id, value, onChange, label = "Quantity" }) => (
  <label className="qty-select" htmlFor={id}>
    <span className="qty-select__label">{label}</span>
    <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {Array.from({ length: MAX_QTY }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  </label>
);

export default QuantitySelect;
