import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiRotateCcw, FiShield, FiTruck } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import { useShop } from "../context/ShopContext";
import { CATEGORIES, FREE_SHIPPING_MIN, sortProducts } from "../utils/catalog";
import ProductRow from "../components/ProductRow";
import { LoadError } from "../components/StatusMessage";
import "../styles/home.css";

const Home = () => {
  const { products, status, retry } = useProducts();
  const { recent } = useShop();
  const loading = status === "loading";

  const rows = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return {
      topRated: sortProducts(products, "rating").slice(0, 10),
      popular: sortProducts(products, "popular").slice(0, 10),
      recent: recent.map((id) => byId.get(id)).filter(Boolean),
      heroPicks: sortProducts(products, "popular").slice(0, 3),
      categoryImages: Object.fromEntries(
        CATEGORIES.map((c) => [c.slug, products.find((p) => p.category === c.apiName)?.image])
      ),
    };
  }, [products, recent]);

  if (status === "error") {
    return (
      <div className="container page">
        <LoadError onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="container page home">
      <section className="hero">
        <div className="hero__copy">
          <p className="hero__eyebrow">Top picks this week</p>
          <h1 className="hero__title">Shop the finds you'll love</h1>
          <p className="hero__text">
            Electronics, fashion and jewelry. Free shipping on orders over ${FREE_SHIPPING_MIN}.
          </p>
          <Link to="/search?sort=popular" className="btn btn--light btn--lg">
            Shop best sellers
          </Link>
        </div>
        <div className="hero__images" aria-hidden="true">
          {rows.heroPicks.map((p) => (
            <div key={p.id} className="hero__image">
              <img src={p.image} alt="" />
            </div>
          ))}
        </div>
      </section>

      <ul className="perks">
        <li>
          <FiTruck aria-hidden="true" /> Free shipping over ${FREE_SHIPPING_MIN}
        </li>
        <li>
          <FiRotateCcw aria-hidden="true" /> 30-day returns
        </li>
        <li>
          <FiShield aria-hidden="true" /> Money-back guarantee
        </li>
      </ul>

      <section>
        <div className="section-heading">
          <h2>Explore popular categories</h2>
        </div>
        <ul className="category-tiles">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/search?category=${c.slug}`} className="category-tile">
                <span className={`category-tile__image ${loading ? "skeleton" : ""}`}>
                  {rows.categoryImages[c.slug] && <img src={rows.categoryImages[c.slug]} alt="" />}
                </span>
                <span className="category-tile__label">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {rows.recent.length > 0 && (
        <ProductRow title="Your recently viewed items" products={rows.recent} />
      )}
      <ProductRow
        title="Top rated"
        seeAllTo="/search?sort=rating"
        products={rows.topRated}
        loading={loading}
      />
      <ProductRow
        title="Trending right now"
        seeAllTo="/search?sort=popular"
        products={rows.popular}
        loading={loading}
      />
    </div>
  );
};

export default Home;
