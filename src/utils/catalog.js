export const CATEGORIES = [
  { slug: "electronics", apiName: "electronics", label: "Electronics" },
  { slug: "jewelry", apiName: "jewelery", label: "Jewelry & Watches" },
  { slug: "mens-clothing", apiName: "men's clothing", label: "Men's Fashion" },
  { slug: "womens-clothing", apiName: "women's clothing", label: "Women's Fashion" },
];

export const SORT_OPTIONS = [
  { value: "best", label: "Best Match" },
  { value: "price-asc", label: "Price: lowest first" },
  { value: "price-desc", label: "Price: highest first" },
  { value: "rating", label: "Customer rating" },
  { value: "popular", label: "Most reviewed" },
];

export const FREE_SHIPPING_MIN = 50;
export const SHIPPING_FEE = 5.99;
export const MAX_QTY = 10;

export const categoryByApiName = (apiName) =>
  CATEGORIES.find((c) => c.apiName === apiName);

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatPrice = (amount) => currency.format(amount);

export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;

export function deliveryWindow(from = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const addDays = (n) => new Date(from.getTime() + n * 86400000);
  return `${fmt.format(addDays(3))} – ${fmt.format(addDays(7))}`;
}

export function matchesQuery(product, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = `${product.title} ${
    categoryByApiName(product.category)?.label ?? product.category
  }`.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

/**
 * Applies search, category, price and rating filters. Any filter left empty is ignored.
 */
export function filterProducts(products, { q = "", category, min, max, rating }) {
  const cat = category && categoryBySlug(category);
  const minPrice = parseFloat(min);
  const maxPrice = parseFloat(max);
  const minRating = parseFloat(rating);

  return products.filter(
    (p) =>
      matchesQuery(p, q) &&
      (!cat || p.category === cat.apiName) &&
      (Number.isNaN(minPrice) || p.price >= minPrice) &&
      (Number.isNaN(maxPrice) || p.price <= maxPrice) &&
      (Number.isNaN(minRating) || p.rating.rate >= minRating)
  );
}

export function sortProducts(products, sort) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case "popular":
      return sorted.sort((a, b) => b.rating.count - a.rating.count);
    default:
      return sorted;
  }
}
