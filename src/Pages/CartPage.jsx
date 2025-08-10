import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();

  const handleRemove = (id, title) => {
    toast(
      (t) => (
        <div style={{ textAlign: "center" }}>
          <p className="mb-2">
            Are you sure you want to remove <b>{title}</b>?
          </p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                removeFromCart(id);
                toast.dismiss(t.id);
              }}
            >
              Yes, Remove
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity, style: { background: "#333", color: "#fff" } }
    );
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discountpercentage) || 0;
    const discountedPrice = Math.round(price * (1 - discount / 100));
    return acc + item.quantity * discountedPrice;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <Container className="empty-cart-container text-center">
        <FaShoppingCart size={80} className="mb-4 text-white-50" />
        <h2 className="fw-bold text-white">Your Cart is Currently Empty</h2>
        <Link to="/products">
          <Button variant="primary" size="lg" className="mt-3 action-btn">
            Return to Shop
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-5">
      <h1 className="mb-5 fw-bold text-white text-center">
        Your Shopping Cart
      </h1>
      <Row className="gy-4">
        <Col lg={8}>
          {cartItems.map((item) => {
            const price = Number(item.price) || 0;
            const discount = Number(item.discountpercentage) || 0;
            const discountedPrice = Math.round(price * (1 - discount / 100));

            return (
              <div key={item.productid} className="cart-item-card">
                {" "}
                <Row className="align-items-center">
                  <Col md={2} xs={3}>
                    <Image src={item.thumbnail} alt={item.name} fluid rounded />{" "}
                  </Col>
                  <Col md={4} xs={9}>
                    <Link
                      to={`/product/${item.productid}`}
                      className="text-white h5 text-decoration-none"
                    >
                      {" "}
                      {item.name}
                    </Link>
                    <p className="text-white-50 mb-0">
                      Price: ₹{discountedPrice}
                    </p>
                  </Col>
                  <Col
                    md={3}
                    xs={6}
                    className="mt-3 mt-md-0 d-flex justify-content-center"
                  >
                    <div className="quantity-selector">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateCartQuantity(item.productid, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        {" "}
                        <FaMinus />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateCartQuantity(item.productid, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        {" "}
                        <FaPlus />
                      </button>
                    </div>
                  </Col>
                  <Col
                    md={2}
                    xs={4}
                    className="text-end fw-bold text-white mt-3 mt-md-0"
                  >
                    ₹{(discountedPrice * item.quantity).toFixed(2)}
                  </Col>
                  <Col md={1} xs={2} className="text-end mt-3 mt-md-0">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item.productid, item.name)}
                    >
                      {" "}
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Col>
        <Col lg={4}>
          <div className="order-summary-card">
            <h4 className="mb-4">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2 text-white-50">
              <span>Subtotal ({totalItems} items)</span>
              <span className="text-white fw-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-white-50">
              <span>Shipping</span>
              <span className="text-white">FREE</span>
            </div>
            <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
            <div className="d-flex justify-content-between fw-bold h5 text-white">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-4">
              <p className="text-white-50">Have a Coupon Code?</p>
              <InputGroup>
                <Form.Control
                  placeholder="Enter Coupon"
                  className="coupon-input"
                />
                <Button variant="outline-light">Apply</Button>
              </InputGroup>
            </div>
            <div className="d-grid mt-4">
              <Link to="/checkout">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 action-btn"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
