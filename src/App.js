import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Item from "./pages/Item";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Watchlist from "./pages/Watchlist";
import NotFound from "./pages/NotFound";

// Keeps links to the old /Details/:id/:category URLs working.
const LegacyDetailsRedirect = () => <Navigate to={`/item/${useParams().id}`} replace />;

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ToastProvider>
          <ScrollToTop />
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main" className="site-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/item/:id" element={<Item />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/Details/:id/*" element={<LegacyDetailsRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </ToastProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
