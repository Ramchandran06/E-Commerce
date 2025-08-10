import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useWishlist } from "../context/WishlistContext";
import "./Header.css";

const Header = ({ handleProfileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    setExpanded(false);
    navigate("/login");
  };

  const closeMenu = () => setExpanded(false);

  const isCategoryActive =
    location.pathname.startsWith("/category/") ||
    location.pathname === "/categories";

  return (
    <div className="navbar-main-wrapper">
      <Navbar
        expand="lg"
        className="navbar-fullwidth-glass"
        expanded={expanded}
        onToggle={() => setExpanded((prevExpanded) => !prevExpanded)}
      >
        <Container>
          <LinkContainer to="/" onClick={closeMenu}>
            <Navbar.Brand className="brand-title-large  ">
              SIT Dress Shop
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-toggler-icon"
          />

          <Navbar.Collapse id="basic-navbar-nav  ">
            <Nav className="ms-auto align-items-center ">
              <LinkContainer to="/" onClick={closeMenu}>
                <Nav.Link className="nav-link-pill">Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about" onClick={closeMenu}>
                <Nav.Link className="nav-link-pill">About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/products" onClick={closeMenu}>
                <Nav.Link className="nav-link-pill">Products</Nav.Link>
              </LinkContainer>

              <NavDropdown
                title="Categories"
                id="categories-dropdown"
                className={`nav-link-pill dropdown  ${
                  isCategoryActive ? "active " : ""
                }`}
              >
                <LinkContainer to="/category/sarees" onClick={closeMenu}>
                  <NavDropdown.Item>Sarees</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/category/kurtis" onClick={closeMenu}>
                  <NavDropdown.Item>Kurtis</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/category/western" onClick={closeMenu}>
                  <NavDropdown.Item>Western Wear</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/categories" onClick={closeMenu}>
                  <NavDropdown.Item className="fw-bold">
                    View All Categories
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              <LinkContainer to="/contact" onClick={closeMenu}>
                <Nav.Link className="nav-link-pill">Contact</Nav.Link>
              </LinkContainer>

              <SearchBar />

              <LinkContainer to="/cart" onClick={closeMenu}>
                <Nav.Link className="icon-link">
                  <div className="cart-icon-wrapper">
                    <FaShoppingCart />
                    {cartCount > 0 && (
                      <Badge pill bg="primary" className="cart-badge">
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/wishlist" onClick={closeMenu}>
                <Nav.Link className="icon-link">
                  <div className="cart-icon-wrapper">
                    <FaHeart />
                    {wishlistItems.length > 0 && (
                      <Badge pill bg="danger" className="cart-badge">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </div>
                </Nav.Link>
              </LinkContainer>

              {user ? (
                <NavDropdown
                  title={
                    <>
                      <FaUser className="ms-10 " />
                      {user.fullname?.split(" ")[0]}
                    </>
                  }
                  id="user-dropdown"
                  className="user-dropdown dropdown"
                >
                  <NavDropdown.Item
                    onClick={() => {
                      handleProfileOpen();
                      closeMenu();
                    }}
                  >
                    My Profile
                  </NavDropdown.Item>
                  <LinkContainer to="/my-orders" onClick={closeMenu}>
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  {user.role === "admin" && (
                    <LinkContainer to="/admin" onClick={closeMenu}>
                      <NavDropdown.Item>Admin Panel</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login" onClick={closeMenu}>
                  <Nav.Link className="icon-link">
                    <FaUser />
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
