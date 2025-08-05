import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import "./CheckoutPage.css";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPlacing, setOrderPlacing] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/addresses");
        const userAddresses = response.data;
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          const defaultAddress = userAddresses.find((addr) => addr.IsDefault);
          setSelectedAddressId(
            defaultAddress
              ? defaultAddress.AddressID
              : userAddresses[0].AddressID
          );
        } else {
          setError(
            "You have no saved addresses. Please add an address in your profile."
          );
        }
      } catch (err) {
        setError("Could not load your addresses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const discountedPrice = item.Price;
    return acc + item.qty * discountedPrice;
  }, 0);

  const placeOrderHandler = async () => {
    if (!selectedAddressId) {
      return toast.error("Please select a shipping address.");
    }
    setOrderPlacing(true);

    if (paymentMethod === "COD") {
      try {
        const payload = {
          addressId: selectedAddressId,
          paymentMethod: "COD",
        };
        const response = await axios.post("/api/orders", payload);
        toast.success(response.data.message || "Order placed successfully!");
        clearCart();
        navigate(`/my-orders`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to place order.");
      } finally {
        setOrderPlacing(false);
      }
      return;
    }

    if (paymentMethod === "Online") {
      try {
        const orderResponse = await axios.post(
          "/api/orders/razorpay/create-order",
          {
            amount: Math.round(subtotal * 100),
          }
        );
        const razorpayOrder = orderResponse.data;

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "SIT Dress Shop",
          description: "Transaction for your order",
          order_id: razorpayOrder.id,

          handler: async function (response) {
            console.log("Razorpay success response:", response);
            try {
              const verificationPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                addressId: selectedAddressId,
                paymentMethod: "Online",
              };
              console.log("Sending verification payload:", verificationPayload);

              await axios.post(
                "/api/orders/razorpay/verify-payment",
                verificationPayload
              );
              toast.success("Payment successful and order placed!");
              clearCart();
              if (user && user.Role === "admin") {
                navigate("/admin");
              } else {
                navigate("/my-orders");
              }
            } catch (err) {
              console.error("VERIFICATION FAILED:", err);
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: user.FullName,
            email: user.Email,
            contact: user.Mobile,
          },
          theme: {
            color: "#8A2BE2",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", function (response) {
          toast.error("Payment failed. Please try again.");
          setOrderPlacing(false);
        });
      } catch (error) {
        toast.error("Could not initiate online payment. Please try again.");
        setOrderPlacing(false);
      }
    }
  };

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );

  if (cartItems.length === 0) {
    return (
      <Container className="text-center my-5 py-5">
        <h2 className="text-white">Your cart is empty.</h2>
        <Link to="/products">
          <Button variant="primary" className="mt-3">
            Go to Products
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-5">
      <h1 className="fw-bold text-white text-center mb-5">Checkout</h1>
      <Row className="gy-4">
        <Col lg={7}>
          <div className="checkout-form-card">
            {/* Shipping Address Section */}
            <h4 className="mb-4">1. Select Shipping Address</h4>
            {error && (
              <Alert variant="warning">
                {error} <Link to="/profile">Add Address</Link>
              </Alert>
            )}
            {addresses.map((addr) => (
              <div key={addr.AddressID} className="address-selection-card mb-3">
                <Form.Check
                  type="radio"
                  id={`addr-${addr.AddressID}`}
                  name="shippingAddress"
                  checked={selectedAddressId === addr.AddressID}
                  onChange={() => setSelectedAddressId(addr.AddressID)}
                  label={
                    <div>
                      <p className="fw-bold mb-1">
                        {addr.AddressLine1}, {addr.AddressLine2}
                      </p>
                      <p className="text-white-50 mb-0">
                        {addr.City}, {addr.State} - {addr.PostalCode}
                      </p>
                    </div>
                  }
                />
              </div>
            ))}
            <Link to="/profile" state={{ openProfile: true, tab: "addresses" }}>
              + Manage Addresses
            </Link>

            <hr className="my-4" />

            {/* Payment Method Section */}
            <h4 className="mb-3">2. Payment Method</h4>
            <div className="payment-selection-card">
              <Form.Check
                type="radio"
                id="cod-payment"
                name="paymentMethod"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                label={<span className="fw-bold">Cash on Delivery (COD)</span>}
              />
            </div>
            <div className="payment-selection-card">
              <Form.Check
                type="radio"
                id="cod-payment"
                name="paymentMethod"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                label={<span className="fw-bold">Online Payment </span>}
              />
            </div>
            <div className="payment-selection-card">
              <Form.Check
                type="radio"
                id="online-payment"
                name="paymentMethod"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
                label={
                  <span className="fw-bold">
                    Online Payment (Card, UPI, etc.)
                  </span>
                }
              />
            </div>
          </div>
        </Col>

        {/* Order Summary Section */}
        <Col lg={5}>
          <div className="checkout-summary-card">
            <h4>Your Order</h4>
            <hr />
            {cartItems.map((item) => {
              const discountedPrice = Math.round(
                item.Price * (1 - item.DiscountPercentage / 100)
              );
              return (
                <Row key={item.ProductID} className="align-items-center mb-3">
                  <Col xs={3}>
                    <Image
                      src={item.Thumbnail}
                      fluid
                      rounded
                      className="summary-item-img"
                    />
                  </Col>
                  <Col xs={6}>
                    <p className="mb-0">
                      {item.Name}
                      <br />
                      <small className="text-white-50">Qty: {item.qty}</small>
                    </p>
                  </Col>
                  <Col xs={3} className="text-end">
                    ₹{discountedPrice * item.qty}
                  </Col>
                </Row>
              );
            })}
            <hr />
            <div className="d-flex justify-content-between h5">
              <span>Total</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>
            <div className="d-grid mt-4">
              <Button
                variant="primary"
                type="button"
                size="lg"
                className="action-btn"
                onClick={placeOrderHandler}
                disabled={loading || addresses.length === 0}
              >
                {loading ? (
                  <Spinner as="span" size="sm" />
                ) : (
                  `Place Order (Pay ₹${subtotal.toFixed(2)})`
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
