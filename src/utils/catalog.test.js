import { filterProducts, shippingFor, sortProducts } from "./catalog";

const products = [
  { id: 1, title: "Slim Fit Cotton Jacket", price: 55.99, category: "men's clothing", rating: { rate: 4.7, count: 500 } },
  { id: 2, title: "Gold Plated Ring", price: 9.99, category: "jewelery", rating: { rate: 3, count: 400 } },
  { id: 3, title: "Portable SSD 1TB", price: 109, category: "electronics", rating: { rate: 4.8, count: 319 } },
  { id: 4, title: "Rain Jacket Women", price: 39.99, category: "women's clothing", rating: { rate: 3.8, count: 679 } },
];

const ids = (list) => list.map((p) => p.id);

describe("filterProducts", () => {
  it("returns everything when no filters are set", () => {
    expect(ids(filterProducts(products, {}))).toEqual([1, 2, 3, 4]);
  });

  it("matches every search term, case-insensitively", () => {
    expect(ids(filterProducts(products, { q: "JACKET" }))).toEqual([1, 4]);
    expect(ids(filterProducts(products, { q: "jacket women" }))).toEqual([4]);
  });

  it("matches the category label as well as the title", () => {
    expect(ids(filterProducts(products, { q: "electronics" }))).toEqual([3]);
  });

  it("filters by category slug, price range and minimum rating", () => {
    expect(ids(filterProducts(products, { category: "jewelry" }))).toEqual([2]);
    expect(ids(filterProducts(products, { min: "10", max: "60" }))).toEqual([1, 4]);
    expect(ids(filterProducts(products, { rating: "4" }))).toEqual([1, 3]);
  });

  it("ignores an unknown category slug", () => {
    expect(filterProducts(products, { category: "boats" })).toHaveLength(4);
  });
});

describe("sortProducts", () => {
  it("sorts without mutating the input", () => {
    expect(ids(sortProducts(products, "price-asc"))).toEqual([2, 4, 1, 3]);
    expect(ids(sortProducts(products, "price-desc"))).toEqual([3, 1, 4, 2]);
    expect(ids(sortProducts(products, "rating"))).toEqual([3, 1, 4, 2]);
    expect(ids(sortProducts(products, "popular"))).toEqual([4, 1, 2, 3]);
    expect(ids(products)).toEqual([1, 2, 3, 4]);
  });
});

describe("shippingFor", () => {
  it("is free for empty carts and orders of $50 or more", () => {
    expect(shippingFor(0)).toBe(0);
    expect(shippingFor(49.99)).toBe(5.99);
    expect(shippingFor(50)).toBe(0);
  });
});
