import React from "react";
import { Link } from "react-router-dom";

const LETTERS = [
  ["e", "#e53238"],
  ["s", "#0064d2"],
  ["h", "#f5af02"],
  ["o", "#86b817"],
  ["p", "#e53238"],
];

const Logo = () => (
  <Link to="/" className="logo" aria-label="eshop home">
    {LETTERS.map(([letter, color], i) => (
      <span key={i} style={{ color }}>
        {letter}
      </span>
    ))}
  </Link>
);

export default Logo;
