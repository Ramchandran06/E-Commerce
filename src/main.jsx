import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext.jsx";
import AuthEffects from "./context/AuthEffects";

axios.defaults.baseURL = "http://localhost:5000";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AuthEffects />
          <App />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>
);
