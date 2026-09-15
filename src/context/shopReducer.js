import { MAX_QTY } from "../utils/catalog";

export const RECENT_LIMIT = 12;

export const emptyShop = { cart: [], watchlist: [], recent: [] };

// Only the fields the UI needs are stored, so saved state stays small.
const snapshot = ({ id, title, price, image, category, rating }) => ({
  id,
  title,
  price,
  image,
  category,
  rating,
});

const clampQty = (qty) => Math.max(1, Math.min(MAX_QTY, qty));

export function shopReducer(state, action) {
  switch (action.type) {
    case "cart/add": {
      const { product, qty } = action;
      const existing = state.cart.find((item) => item.id === product.id);
      const cart = existing
        ? state.cart.map((item) =>
            item.id === product.id ? { ...item, qty: clampQty(item.qty + qty) } : item
          )
        : [...state.cart, { ...snapshot(product), qty: clampQty(qty) }];
      return { ...state, cart };
    }
    case "cart/setQty":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.id ? { ...item, qty: clampQty(action.qty) } : item
        ),
      };
    case "cart/remove":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.id) };
    case "cart/clear":
      return { ...state, cart: [] };
    case "watchlist/toggle": {
      const watching = state.watchlist.some((item) => item.id === action.product.id);
      return {
        ...state,
        watchlist: watching
          ? state.watchlist.filter((item) => item.id !== action.product.id)
          : [snapshot(action.product), ...state.watchlist],
      };
    }
    case "cart/saveForLater": {
      const item = state.cart.find((i) => i.id === action.id);
      if (!item) return state;
      const alreadyWatched = state.watchlist.some((i) => i.id === action.id);
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.id),
        watchlist: alreadyWatched ? state.watchlist : [snapshot(item), ...state.watchlist],
      };
    }
    case "recent/add":
      return {
        ...state,
        recent: [action.id, ...state.recent.filter((id) => id !== action.id)].slice(
          0,
          RECENT_LIMIT
        ),
      };
    default:
      return state;
  }
}
