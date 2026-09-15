import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiGrid, FiList, FiSearch, FiSliders, FiX } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import {
  CATEGORIES,
  SORT_OPTIONS,
  categoryBySlug,
  filterProducts,
  formatPrice,
  sortProducts,
} from "../utils/catalog";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import StatusMessage, { LoadError } from "../components/StatusMessage";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/search.css";

const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
];

const Search = () => {
  const { products, status, retry } = useProducts();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      q: params.get("q") ?? "",
      category: params.get("category") ?? "",
      min: params.get("min") ?? "",
      max: params.get("max") ?? "",
      rating: params.get("rating") ?? "",
    }),
    [params]
  );
  const sort = params.get("sort") ?? "best";
  const view = params.get("view") === "list" ? "list" : "grid";
  const category = categoryBySlug(filters.category);

  const [priceDraft, setPriceDraft] = useState({ min: filters.min, max: filters.max });
  useEffect(() => {
    setPriceDraft({ min: filters.min, max: filters.max });
  }, [filters.min, filters.max]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    [products, filters, sort]
  );

  // Counts per category reflect every active filter except the category itself.
  const categoryCounts = useMemo(() => {
    const pool = filterProducts(products, { ...filters, category: "" });
    return Object.fromEntries(
      CATEGORIES.map((c) => [c.slug, pool.filter((p) => p.category === c.apiName).length])
    );
  }, [products, filters]);

  const chips = [
    filters.q && { key: "q", label: `"${filters.q}"` },
    category && { key: "category", label: category.label },
    filters.min && { key: "min", label: `Over ${formatPrice(filters.min)}` },
    filters.max && { key: "max", label: `Under ${formatPrice(filters.max)}` },
    filters.rating && { key: "rating", label: `${filters.rating}★ & up` },
  ].filter(Boolean);

  const clearAll = () => {
    const next = new URLSearchParams();
    if (sort !== "best") next.set("sort", sort);
    if (view === "list") next.set("view", "list");
    setParams(next, { replace: true });
  };

  const heading = filters.q
    ? `results for "${filters.q}"`
    : category
    ? `results in ${category.label}`
    : "items for sale";

  if (status === "error") {
    return (
      <div className="container page">
        <LoadError onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="container page search-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          ...(category ? [{ label: category.label }] : [{ label: "All items" }]),
        ]}
      />

      <div className="search-page__layout">
        <aside className={`filters ${filtersOpen ? "is-open" : ""}`} aria-label="Filters">
          <div className="filters__header">
            <h2>Filters</h2>
            <button
              className="icon-btn filters__close"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              <FiX />
            </button>
          </div>

          <fieldset className="filters__group">
            <legend>Category</legend>
            <label className="filters__option">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => updateParams({ category: "" })}
              />
              All categories
            </label>
            {CATEGORIES.map((c) => (
              <label key={c.slug} className="filters__option">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === c.slug}
                  onChange={() => updateParams({ category: c.slug })}
                />
                {c.label}
                <span className="filters__count">{categoryCounts[c.slug] ?? 0}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="filters__group">
            <legend>Price</legend>
            <form
              className="filters__price"
              onSubmit={(e) => {
                e.preventDefault();
                updateParams(priceDraft);
              }}
            >
              <label>
                <span className="visually-hidden">Minimum price</span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  placeholder="$ Min"
                  value={priceDraft.min}
                  onChange={(e) => setPriceDraft((d) => ({ ...d, min: e.target.value }))}
                />
              </label>
              <span aria-hidden="true">to</span>
              <label>
                <span className="visually-hidden">Maximum price</span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  placeholder="$ Max"
                  value={priceDraft.max}
                  onChange={(e) => setPriceDraft((d) => ({ ...d, max: e.target.value }))}
                />
              </label>
              <button type="submit" className="btn btn--secondary btn--sm" aria-label="Apply price">
                Go
              </button>
            </form>
          </fieldset>

          <fieldset className="filters__group">
            <legend>Customer rating</legend>
            {RATING_OPTIONS.map((o) => (
              <label key={o.value} className="filters__option">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === o.value}
                  onChange={() => updateParams({ rating: o.value })}
                />
                {o.label}
              </label>
            ))}
          </fieldset>

          <button className="btn btn--primary btn--block filters__done" onClick={() => setFiltersOpen(false)}>
            Show {results.length} results
          </button>
        </aside>

        <section className="results" aria-labelledby="results-heading">
          <div className="results__toolbar">
            <h1 id="results-heading" className="results__heading">
              {status === "loading" ? (
                "Searching…"
              ) : (
                <>
                  <strong>{results.length}</strong> {heading}
                </>
              )}
            </h1>
            <div className="results__controls">
              <button className="btn btn--secondary btn--sm filters-toggle" onClick={() => setFiltersOpen(true)}>
                <FiSliders aria-hidden="true" /> Filters{chips.length > 0 && ` (${chips.length})`}
              </button>
              <label className="results__sort">
                <span>Sort:</span>
                <select value={sort} onChange={(e) => updateParams({ sort: e.target.value === "best" ? "" : e.target.value })}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="view-toggle" role="group" aria-label="Layout">
                <button
                  className="icon-btn"
                  aria-pressed={view === "grid"}
                  aria-label="Grid view"
                  onClick={() => updateParams({ view: "" })}
                >
                  <FiGrid />
                </button>
                <button
                  className="icon-btn"
                  aria-pressed={view === "list"}
                  aria-label="List view"
                  onClick={() => updateParams({ view: "list" })}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="chips">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  className="chip"
                  onClick={() => updateParams({ [chip.key]: "" })}
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label} <FiX aria-hidden="true" />
                </button>
              ))}
              <button className="link-btn" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {status === "loading" ? (
            <ProductGridSkeleton layout={view} />
          ) : results.length === 0 ? (
            <StatusMessage
              icon={<FiSearch />}
              title="No exact matches found"
              actions={
                chips.length > 0 && (
                  <button className="btn btn--primary" onClick={clearAll}>
                    Clear filters
                  </button>
                )
              }
            >
              Try fewer words, check your spelling, or remove some filters.
            </StatusMessage>
          ) : (
            <div className={view === "list" ? "product-list" : "product-grid"}>
              {results.map((p) => (
                <ProductCard key={p.id} product={p} layout={view} />
              ))}
            </div>
          )}
        </section>
      </div>
      {filtersOpen && <div className="filters-backdrop" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
};

export default Search;
