import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { emptyShop, shopReducer } from "./shopReducer";

const STORAGE_KEY = "eshop:v1";
const ShopContext = createContext(null);

function loadShop() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved) return emptyShop;
    return {
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      watchlist: Array.isArray(saved.watchlist) ? saved.watchlist : [],
      recent: Array.isArray(saved.recent) ? saved.recent : [],
    };
  } catch {
    return emptyShop;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, undefined, loadShop);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota); the shop still works in memory.
    }
  }, [state]);

  // dispatch never changes, so these keep a stable identity and are safe in effect deps.
  const actions = useMemo(
    () => ({
      addToCart: (product, qty = 1) => dispatch({ type: "cart/add", product, qty }),
      setQuantity: (id, qty) => dispatch({ type: "cart/setQty", id, qty }),
      removeFromCart: (id) => dispatch({ type: "cart/remove", id }),
      saveForLater: (id) => dispatch({ type: "cart/saveForLater", id }),
      clearCart: () => dispatch({ type: "cart/clear" }),
      toggleWatch: (product) => dispatch({ type: "watchlist/toggle", product }),
      addRecent: (id) => dispatch({ type: "recent/add", id }),
    }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      ...actions,
      cartCount: state.cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal: state.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      isWatched: (id) => state.watchlist.some((item) => item.id === id),
    }),
    [state, actions]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside <ShopProvider>");
  return context;
}
