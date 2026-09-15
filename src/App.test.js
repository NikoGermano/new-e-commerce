import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const products = [
  { id: 1, title: "Mens Cotton Jacket", price: 55.99, description: "Warm.", category: "men's clothing", image: "jacket.png", rating: { rate: 4.7, count: 500 } },
  { id: 2, title: "Gold Plated Ring", price: 9.99, description: "Shiny.", category: "jewelery", image: "ring.png", rating: { rate: 3, count: 400 } },
  { id: 3, title: "Rain Jacket Women", price: 39.99, description: "Dry.", category: "women's clothing", image: "rain.png", rating: { rate: 3.8, count: 679 } },
];

const renderAt = (path) => {
  window.history.pushState({}, "", path);
  return render(<App />);
};

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = jest.fn();
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(products) }));
});

test("search suggestions filter as you type and Enter opens the results page", async () => {
  renderAt("/");
  await screen.findAllByText("Mens Cotton Jacket");

  const input = screen.getByRole("combobox", { name: /search for anything/i });
  userEvent.type(input, "jacket");
  const listbox = screen.getByRole("listbox");
  expect(within(listbox).getAllByRole("option")).toHaveLength(2);

  userEvent.type(input, "{enter}");
  expect(await screen.findByRole("heading", { name: /2 results for "jacket"/i })).toBeInTheDocument();
  expect(window.location.search).toBe("?q=jacket");
});

test("adding an item updates the cart badge, shows a toast and persists", async () => {
  renderAt("/item/2");
  userEvent.selectOptions(await screen.findByLabelText("Quantity"), "3");
  userEvent.click(screen.getByRole("button", { name: "Add to cart" }));

  expect(screen.getByRole("status")).toHaveTextContent(/added to cart/i);
  expect(screen.getAllByRole("link", { name: "Cart, 3 items" }).length).toBeGreaterThan(0);
  expect(JSON.parse(window.localStorage.getItem("eshop:v1")).cart[0]).toMatchObject({ id: 2, qty: 3 });
});

test("checkout validates the form, then confirms the order and empties the cart", async () => {
  window.localStorage.setItem(
    "eshop:v1",
    JSON.stringify({ cart: [{ ...products[0], qty: 1 }], watchlist: [], recent: [] })
  );
  renderAt("/checkout");

  userEvent.click(screen.getByRole("button", { name: "Place order" }));
  expect(screen.getByText("Enter your full name")).toBeInTheDocument();
  expect(screen.getByLabelText("Full name")).toHaveFocus();

  userEvent.type(screen.getByLabelText("Full name"), "Ada Lovelace");
  userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  userEvent.type(screen.getByLabelText("Street address"), "1 Main St");
  userEvent.type(screen.getByLabelText("City"), "Springfield");
  userEvent.type(screen.getByLabelText("State"), "IL");
  userEvent.type(screen.getByLabelText("ZIP code"), "123");
  userEvent.click(screen.getByRole("button", { name: "Place order" }));
  expect(screen.getByText("Enter a 5-digit ZIP code")).toBeInTheDocument();

  userEvent.type(screen.getByLabelText("ZIP code"), "45");
  userEvent.click(screen.getByRole("button", { name: "Place order" }));

  expect(await screen.findByRole("heading", { name: /thanks, ada/i })).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem("eshop:v1")).cart).toEqual([]);
});

test("old /Details links redirect to the new item page", async () => {
  renderAt("/Details/3/women's clothing");
  expect(await screen.findByRole("heading", { name: "Rain Jacket Women" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/item/3");
});
