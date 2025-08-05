import React, { useState, useEffect } from "react";
import {
  Container,
  Accordion,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./MyOrdersPage.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch your orders.");
      console.error("Fetch My Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShowReturnModal = (item) => {
    setSelectedItem(item);
    setShowReturnModal(true);
  };
  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setSelectedItem(null);
    setReturnReason("");
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnReason) {
      return toast.error("Please select a reason for the return.");
    }
    setIsSubmittingReturn(true);
    try {
      const payload = {
        orderItemId: selectedItem.OrderItemID,
        quantity: selectedItem.Quantity,
        reason: returnReason,
      };
      const response = await axios.post("/api/returns/request", payload);
      toast.success(response.data.message);
      handleCloseReturnModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return "secondary";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "processing":
        return "primary";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="light" />
        <p className="text-white mt-2">Loading your orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-5">
      <h1 className="text-white fw-bold text-center mb-5">My Orders</h1>

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          You have not placed any orders yet.{" "}
          <Link to="/products">Start Shopping!</Link>
        </Alert>
      ) : (
        <Accordion defaultActiveKey="0" flush>
          {orders.map((order, index) => (
            <Accordion.Item
              key={order.OrderID}
              eventKey={String(index)}
              className="order-accordion-item mb-3"
            >
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 align-items-center pe-3">
                  <div>
                    <span className="fw-bold">Order #{order.OrderID}</span>
                    <br />
                    <small className="text-secondary">
                      Placed on:{" "}
                      {new Date(order.OrderDate).toLocaleDateString()}
                    </small>
                  </div>
                  <Badge bg={getStatusBadge(order.OrderStatus)} pill>
                    {order.OrderStatus}
                  </Badge>
                  <span className="fw-bold">
                    ₹{Number(order.TotalPrice).toLocaleString("en-IN")}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <h6>Items in this order:</h6>
                {order.Items.map((item) => (
                  <Row
                    key={item.OrderItemID}
                    className="align-items-center my-3"
                  >
                    <Col xs={2} md={1}>
                      <Image src={item.Thumbnail} fluid rounded />
                    </Col>
                    <Col xs={6} md={7}>
                      <p className="mb-0">{item.ProductName}</p>
                      <small className="text-secondary">Qty: {item.Quantity}</small>
                    </Col>
                    <Col xs={4} md={2} className="text-end">
                      ₹{Number(item.Price).toLocaleString("en-IN")}
                    </Col>
                    <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
                      {order.OrderStatus === "Delivered" && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleShowReturnModal(item)}
                        >
                          Return Item
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                <hr />
                {order.ShippingAddress && (
                  <div>
                    <h6>Shipping Address:</h6>
                    <p className="mb-0">{order.ShippingAddress.AddressLine1}</p>
                    {order.ShippingAddress.AddressLine2 && (
                      <p className="mb-0">
                        {order.ShippingAddress.AddressLine2}
                      </p>
                    )}
                    <p>
                      {order.ShippingAddress.City},{" "}
                      {order.ShippingAddress.State} -{" "}
                      {order.ShippingAddress.PostalCode}
                    </p>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
      {/* Return Request Modal */}
      {selectedItem && (
        <Modal show={showReturnModal} onHide={handleCloseReturnModal} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>Request Return</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleReturnSubmit}>
            <Modal.Body className="bg-dark text-white">
              <p>You are requesting a return for:</p>
              <p className="fw-bold">
                {selectedItem.ProductName} (Qty: {selectedItem.Quantity})
              </p>
              <hr />
              <Form.Group>
                <FloatingLabel
                  controlId="returnReason"
                  label="Reason for Return"
                >
                  <Form.Select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    required
                  >
                    <option value="">-- Select a reason --</option>
                    <option value="Damaged or defective item">
                      Damaged or defective item
                    </option>
                    <option value="Received wrong item">
                      Received wrong item
                    </option>
                    <option value="Size or fit issue">Size or fit issue</option>
                    <option value="Item not as described">
                      Item not as described
                    </option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Others">Others</option>
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
              <Button variant="secondary" onClick={handleCloseReturnModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmittingReturn}
              >
                {isSubmittingReturn ? (
                  <Spinner as="span" size="sm" />
                ) : (
                  "Submit Request"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default MyOrdersPage;
