import { useCallback, useEffect, useState } from "react";
import { fetchProducts, getCachedProducts } from "../api/products";

export default function useProducts() {
  const [state, setState] = useState(() => {
    const cached = getCachedProducts();
    return cached
      ? { status: "success", products: cached, error: null }
      : { status: "loading", products: [], error: null };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((products) => {
        if (!cancelled) setState({ status: "success", products, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", products: [], error });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading", products: [], error: null });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
