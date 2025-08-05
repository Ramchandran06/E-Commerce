import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/cart");
          setCartItems(response.data);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [user, token]);

  const addToCart = async (productToAdd, quantity = 1) => {
    if (!user) {
      toast(
        (t) => (
          <span>
            Please <b>Login</b> to add items to your cart.
            <Link
              to="/login"
              onClick={() => toast.dismiss(t.id)}
              style={{
                marginLeft: "10px",
                color: "#00aaff",
                fontWeight: "bold",
              }}
            >
              Login Now
            </Link>
          </span>
        ),
        { icon: "" }
      );
      return;
    }

    try {
      const payload = {
        productId: productToAdd.ProductID,
        quantity: quantity,
      };

      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        payload
      );

      setCartItems(response.data.cart);
      toast.success(`${quantity} x "${productToAdd.Name}" added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Could not add item to cart."
      );
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`
      );

      setCartItems(response.data.cart);
      toast.error(`Item removed from cart.`);
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error(
        error.response?.data?.message || "Could not remove item from cart."
      );
    }
  };

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      const payload = {
        productId: productId,
        quantity: newQuantity,
      };

      const response = await axios.put(
        "http://localhost:5000/api/cart/update",
        payload
      );

      setCartItems(response.data.cart);
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(
        error.response?.data?.message || "Could not update quantity."
      );
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart/clear");
      setCartItems([]);
      toast.success("Cart has been cleared.");
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error("Could not clear the cart.");
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
