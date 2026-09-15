import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import { CATEGORIES, categoryBySlug, matchesQuery } from "../utils/catalog";
import "../styles/searchBar.css";

const MAX_SUGGESTIONS = 6;

function Highlight({ text, query }) {
  const term = query.trim().toLowerCase();
  const index = term ? text.toLowerCase().indexOf(term) : -1;
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <strong>{text.slice(index, index + term.length)}</strong>
      {text.slice(index + term.length)}
    </>
  );
}

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listId = useId();

  // Keep the form in sync with the URL: show the current search on results pages, reset on home.
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("q") ?? "");
      setCategory(params.get("category") ?? "");
    } else if (location.pathname === "/") {
      setQuery("");
      setCategory("");
    }
    setOpen(false);
  }, [location.pathname, location.search]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const cat = categoryBySlug(category);
    return products
      .filter((p) => (!cat || p.category === cat.apiName) && matchesQuery(p, query))
      .slice(0, MAX_SUGGESTIONS);
  }, [products, query, category]);

  const showList = open && suggestions.length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (showList && active >= 0) {
      navigate(`/item/${suggestions[active].id}`);
    } else {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      navigate(`/search${params.toString() ? `?${params}` : ""}`);
    }
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form className="search" role="search" onSubmit={submit}>
      <div className="search__field">
        <FiSearch className="search__icon" aria-hidden="true" />
        <input
          ref={inputRef}
          className="search__input"
          type="search"
          placeholder="Search for anything"
          aria-label="Search for anything"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <select
          className="search__category"
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        {showList && (
          <ul className="search__suggestions" id={listId} role="listbox">
            {suggestions.map((item, i) => (
              <li
                key={item.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="search__suggestion"
                // mousedown fires before the input's blur, so the click isn't lost
                onMouseDown={(e) => {
                  e.preventDefault();
                  navigate(`/item/${item.id}`);
                  setOpen(false);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <img src={item.image} alt="" />
                <span>
                  <Highlight text={item.title} query={query} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" className="btn btn--primary search__submit">
        <FiSearch className="search__submit-icon" aria-hidden="true" />
        <span className="search__submit-label">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
