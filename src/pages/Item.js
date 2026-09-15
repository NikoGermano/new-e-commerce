import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiPackage, FiRotateCcw, FiTruck } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import useAddToCart from "../hooks/useAddToCart";
import { useShop } from "../context/ShopContext";
import {
  FREE_SHIPPING_MIN,
  SHIPPING_FEE,
  categoryByApiName,
  deliveryWindow,
  formatPrice,
} from "../utils/catalog";
import Breadcrumbs from "../components/Breadcrumbs";
import Rating from "../components/Rating";
import QuantitySelect from "../components/QuantitySelect";
import ProductRow from "../components/ProductRow";
import StatusMessage, { LoadError } from "../components/StatusMessage";
import "../styles/item.css";

const DEFAULT_TITLE = document.title;

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, status, retry } = useProducts();
  const { addToCart, toggleWatch, isWatched, addRecent } = useShop();
  const addToCartWithToast = useAddToCart();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => String(p.id) === id);
  const category = product && categoryByApiName(product.category);
  const similar = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id) : []),
    [products, product]
  );

  const productId = product?.id;
  const productTitle = product?.title;
  useEffect(() => {
    setQty(1);
    if (!productId) return;
    addRecent(productId);
    document.title = `${productTitle} | eshop`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [productId, productTitle, addRecent]);

  if (status === "error") {
    return (
      <div className="container page">
        <LoadError onRetry={retry} />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="container page">
        <div className="item item--loading" aria-busy="true">
          <div className="item__gallery skeleton" />
          <div className="item__buybox">
            <div className="skeleton skeleton--line skeleton--title" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line skeleton--price" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page">
        <StatusMessage
          icon={<FiPackage />}
          title="This listing isn't available"
          actions={
            <Link to="/search" className="btn btn--primary">
              Browse all items
            </Link>
          }
        >
          It may have been removed, or the link is incorrect.
        </StatusMessage>
      </div>
    );
  }

  const watching = isWatched(product.id);
  const freeShipping = product.price >= FREE_SHIPPING_MIN;

  return (
    <div className="container page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: category?.label ?? product.category, to: `/search?category=${category?.slug ?? ""}` },
        ]}
      />

      <div className="item">
        <div className="item__gallery">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="item__buybox">
          <h1 className="item__title">{product.title}</h1>
          <a href="#about" className="item__rating">
            <Rating rate={product.rating.rate} count={product.rating.count} size="md" />
            <span className="item__rating-text">{product.rating.rate} out of 5</span>
          </a>

          <hr />

          <p className="item__price">
            <span className="item__currency">US</span> {formatPrice(product.price)}
          </p>
          <p className="item__condition">
            Condition: <strong>Brand New</strong>
          </p>

          <QuantitySelect id="item-qty" value={qty} onChange={setQty} />

          <div className="item__actions">
            <button
              className="btn btn--primary btn--lg btn--block"
              onClick={() => {
                addToCart(product, qty);
                navigate("/checkout");
              }}
            >
              Buy It Now
            </button>
            <button
              className="btn btn--secondary btn--lg btn--block"
              onClick={() => addToCartWithToast(product, qty)}
            >
              Add to cart
            </button>
            <button
              className="btn btn--secondary btn--lg btn--block"
              aria-pressed={watching}
              onClick={() => toggleWatch(product)}
            >
              {watching ? <AiFillHeart aria-hidden="true" /> : <AiOutlineHeart aria-hidden="true" />}
              {watching ? "Watching" : "Add to Watchlist"}
            </button>
          </div>

          <dl className="item__details">
            <div>
              <dt>
                <FiTruck aria-hidden="true" /> Shipping
              </dt>
              <dd>
                {freeShipping ? (
                  <strong>Free standard shipping</strong>
                ) : (
                  <>
                    {formatPrice(SHIPPING_FEE)} standard shipping, or free on orders over{" "}
                    {formatPrice(FREE_SHIPPING_MIN)}
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>
                <FiPackage aria-hidden="true" /> Delivery
              </dt>
              <dd>Estimated between {deliveryWindow()}</dd>
            </div>
            <div>
              <dt>
                <FiRotateCcw aria-hidden="true" /> Returns
              </dt>
              <dd>30 days returns. Seller pays for return shipping.</dd>
            </div>
          </dl>
        </div>
      </div>

      <section id="about" className="item-about">
        <h2>About this item</h2>
        <dl className="item-about__specifics">
          <div>
            <dt>Condition</dt>
            <dd>Brand New</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{category?.label ?? product.category}</dd>
          </div>
          <div>
            <dt>Customer rating</dt>
            <dd>
              {product.rating.rate} / 5 ({product.rating.count} reviews)
            </dd>
          </div>
        </dl>
        <p className="item-about__description">{product.description}</p>
      </section>

      {similar.length > 0 && (
        <ProductRow
          title="Similar items"
          seeAllTo={`/search?category=${category?.slug ?? ""}`}
          products={similar}
        />
      )}
    </div>
  );
};

export default Item;
