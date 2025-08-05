import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("/api/wishlist");
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, []);

  const clearWishlist = useCallback(() => {
    console.log("[WishlistContext] Clear function called.");
    setWishlistItems([]);
  }, []);

  const toggleWishlistItem = async (productId) => {
    try {
      await axios.post("/api/wishlist/toggle", { productId });
      await fetchWishlist();
    } catch (error) {
      console.error("Error toggling wishlist item", error);
    }
  };

  const value = {
    wishlistItems,
    fetchWishlist,
    clearWishlist,
    toggleWishlistItem,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
