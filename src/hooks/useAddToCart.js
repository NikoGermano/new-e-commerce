import { useCallback } from "react";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";

export default function useAddToCart() {
  const { addToCart } = useShop();
  const showToast = useToast();

  return useCallback(
    (product, qty = 1) => {
      addToCart(product, qty);
      showToast({
        title: "Added to cart",
        message: qty > 1 ? `${qty} × ${product.title}` : product.title,
        image: product.image,
        action: { label: "View cart", to: "/cart" },
      });
    },
    [addToCart, showToast]
  );
}
