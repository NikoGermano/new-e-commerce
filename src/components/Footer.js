import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../utils/catalog";
import "../styles/footer.css";

const Footer = () => (
  <footer className="site-footer">
    <div className="container site-footer__grid">
      <div>
        <h2 className="site-footer__heading">Shop</h2>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/search?category=${c.slug}`}>{c.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="site-footer__heading">Your eshop</h2>
        <ul>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/watchlist">Watchlist</Link>
          </li>
          <li>
            <Link to="/search?sort=rating">Top rated items</Link>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="site-footer__heading">About the developer</h2>
        <ul>
          <li>
            <a href="https://www.linkedin.com/in/domenico-germano-556501207/">LinkedIn</a>
          </li>
          <li>
            <a href="https://github.com/Niko-Ibakoo">GitHub</a>
          </li>
          <li>
            <a href="https://nikogermano.com/#portfolio">More projects</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="container site-footer__legal">
      <p>© {new Date().getFullYear()} Domenico Germano. All rights reserved.</p>
      <p>
        Demo project, not affiliated with eBay. No real orders or payments. Product data from{" "}
        <a href="https://fakestoreapi.com">Fake Store API</a>.
      </p>
    </div>
  </footer>
);

export default Footer;
