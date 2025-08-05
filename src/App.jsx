import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./Pages/SearchPage";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Components/MainLayout.jsx";
import AuthLayout from "./Components/AuthLayout.jsx";

import Homepage from "./Pages/Homepage.jsx";
import ProductListPage from "./Pages/ProductListPage.jsx";
import ProductDetailPage from "./Pages/ProductDetailPage.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import AllCategoriesPage from "./Pages/AllCategoriesPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import AboutUsPage from "./Pages/AboutUsPage.jsx";
import AdminLayout from "./Components/AdminLayout.jsx";
import DashboardPage from "./Pages/admin/DashboardPage.jsx";
import ProductListPageAdmin from "./Pages/admin/ProductListPageAdmin.jsx";
import AddProductPage from "./Pages/admin/AddProductPage.jsx";
import OrdersPage from "./Pages/admin/OrdersPage.jsx";
import ProductEditPage from "./Pages/admin/ProductEditPage.jsx";
import MyOrdersPage from "./Pages/MyOrdersPage.jsx";
import SearchResultsPage from "./Pages/SearchResultsPage.jsx";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import ProfilePage from "./Pages/ProfilePage";
import WishlistPage from "./Pages/WishlistPage";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import MessagesPage from "./Pages/admin/MessagesPage";
import FaqManagementPage from "./Pages/admin/FaqManagementPage";
import ReturnsPage from "./Pages/admin/ReturnsPage";
import ScrollToTop from "./Components/ScrollToTop.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductListPageAdmin />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="product/:id/edit" element={<ProductEditPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="faq" element={<FaqManagementPage />} />
            <Route path="returns" element={<ReturnsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
