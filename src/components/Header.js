import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useShop } from "../context/ShopContext";
import { CATEGORIES } from "../utils/catalog";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import "../styles/header.css";

const CartLink = ({ count }) => (
  <Link
    to="/cart"
    className="header-icon"
    aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
  >
    <FiShoppingCart aria-hidden="true" />
    {count > 0 && <span className="header-icon__badge">{count > 99 ? "99+" : count}</span>}
  </Link>
);

const Header = () => {
  const { cartCount, watchlist } = useShop();

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <nav className="utility-bar__links" aria-label="Quick links">
            <span>Hi! Welcome to eshop</span>
            <Link to="/search?sort=rating">Top Rated</Link>
            <Link to="/search?sort=popular">Best Sellers</Link>
          </nav>
          <nav className="utility-bar__links" aria-label="Your account">
            <Link to="/watchlist">Watchlist{watchlist.length > 0 && ` (${watchlist.length})`}</Link>
            <CartLink count={cartCount} />
          </nav>
        </div>
      </div>

      <div className="container header-main">
        <Logo />
        <div className="header-main__actions">
          <Link to="/watchlist" className="header-icon" aria-label="Watchlist">
            <FiHeart aria-hidden="true" />
          </Link>
          <CartLink count={cartCount} />
        </div>
        <SearchBar />
      </div>

      <nav className="category-nav" aria-label="Categories">
        <div className="container category-nav__inner">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/watchlist">Saved</NavLink>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/search?category=${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
