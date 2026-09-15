const API_URL = "https://fakestoreapi.com";

// The catalog is small, so it is fetched once per session and shared by every page.
let request = null;
let cached = null;

export function getCachedProducts() {
  return cached;
}

export function fetchProducts() {
  if (!request) {
    request = fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((products) => {
        cached = products;
        return products;
      })
      .catch((error) => {
        request = null; // allow a retry
        throw error;
      });
  }
  return request;
}
