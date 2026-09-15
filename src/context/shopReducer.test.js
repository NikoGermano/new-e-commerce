import { RECENT_LIMIT, emptyShop, shopReducer } from "./shopReducer";

const jacket = { id: 1, title: "Jacket", price: 50, image: "j.png", category: "men's clothing", rating: { rate: 4, count: 1 }, description: "long text" };
const ring = { id: 2, title: "Ring", price: 10, image: "r.png", category: "jewelery", rating: { rate: 3, count: 1 }, description: "long text" };

const run = (actions, state = emptyShop) => actions.reduce(shopReducer, state);

describe("shopReducer", () => {
  it("adds new items and merges quantities for existing ones", () => {
    const state = run([
      { type: "cart/add", product: jacket, qty: 2 },
      { type: "cart/add", product: ring, qty: 1 },
      { type: "cart/add", product: jacket, qty: 3 },
    ]);
    expect(state.cart.map((i) => [i.id, i.qty])).toEqual([
      [1, 5],
      [2, 1],
    ]);
    expect(state.cart[0].description).toBeUndefined();
  });

  it("clamps quantity between 1 and 10", () => {
    let state = run([{ type: "cart/add", product: jacket, qty: 8 }, { type: "cart/add", product: jacket, qty: 8 }]);
    expect(state.cart[0].qty).toBe(10);
    state = shopReducer(state, { type: "cart/setQty", id: 1, qty: 0 });
    expect(state.cart[0].qty).toBe(1);
  });

  it("moves an item from the cart to the watchlist without duplicating it", () => {
    const state = run([
      { type: "cart/add", product: jacket, qty: 1 },
      { type: "watchlist/toggle", product: jacket },
      { type: "cart/saveForLater", id: 1 },
    ]);
    expect(state.cart).toEqual([]);
    expect(state.watchlist.map((i) => i.id)).toEqual([1]);
  });

  it("toggles watchlist membership", () => {
    const state = run([
      { type: "watchlist/toggle", product: jacket },
      { type: "watchlist/toggle", product: ring },
      { type: "watchlist/toggle", product: jacket },
    ]);
    expect(state.watchlist.map((i) => i.id)).toEqual([2]);
  });

  it("keeps recently viewed items unique, newest first and capped", () => {
    const views = [1, 2, 1, ...Array.from({ length: RECENT_LIMIT + 3 }, (_, i) => i + 10)];
    const state = run(views.map((id) => ({ type: "recent/add", id })));
    expect(state.recent).toHaveLength(RECENT_LIMIT);
    expect(state.recent[0]).toBe(RECENT_LIMIT + 12);
    expect(new Set(state.recent).size).toBe(RECENT_LIMIT);
  });
});
