import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  ListGroup,
  Form,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/orders/admin/all", {
          params: { page: currentPage, limit: 10 },
        });
        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
        } else {
          setOrders([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not fetch orders.");
        console.error("Fetch Admin Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
      case "returned":
        return "dark";
      default:
        return "secondary";
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  const handleShowStatusModal = (order) => {
    setSelectedOrderForStatus(order);
    setNewStatus(order.OrderStatus);
    setShowStatusModal(true);
  };
  const handleCloseStatusModal = () => setShowStatusModal(false);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrderForStatus || !newStatus) return;
    const originalOrders = [...orders];

    const updatedOrders = orders.map((order) =>
      order.OrderID === selectedOrderForStatus.OrderID
        ? { ...order, OrderStatus: newStatus }
        : order
    );
    setOrders(updatedOrders);
    handleCloseStatusModal();

    try {
      const response = await axios.put(
        `/api/orders/admin/${selectedOrderForStatus.OrderID}/status`,
        { status: newStatus }
      );
      toast.success(response.data.message);
      handleCloseStatusModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
      setOrders(originalOrders);
    }
  };

  return (
    <div className="text-white">
      <h1 className="mb-4">Manage Orders</h1>
      {orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.OrderID}>
                  <td>#{order.OrderID}</td>
                  <td>{order.Username}</td>
                  <td>
                    {new Date(order.OrderDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>₹{Number(order.TotalPrice).toLocaleString("en-IN")}</td>
                  <td>
                    <Badge bg={getStatusBadge(order.OrderStatus)}>
                      {order.OrderStatus}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="light"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye /> View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShowStatusModal(order)}
                    >
                      <FaEdit /> Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <ReactPaginate
                forcePage={currentPage - 1}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={
                  "page-link bg-dark text-white border-secondary"
                }
                activeClassName={"active"}
                disabledClassName={"disabled"}
              />
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>Order Details: #{selectedOrder.OrderID}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <h5>Customer: {selectedOrder.Username}</h5>
            <p className="text-muted">{selectedOrder.Email}</p>
            <hr />
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.OrderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge bg={getStatusBadge(selectedOrder.OrderStatus)}>
                {selectedOrder.OrderStatus}
              </Badge>
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.PaymentMethod}
            </p>
            <hr />
            <h6>Items Ordered:</h6>
            <ListGroup variant="flush">
              {selectedOrder.Items?.map((item, index) => {
                const lineTotal = item.Quantity * item.PriceAtTimeOfOrder;

                return (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between bg-dark text-white"
                  >
                    <span>
                      {item.Name} (Qty: {item.Quantity})
                      <br />
                      <small className="text-muted">
                        @ ₹
                        {Number(item.PriceAtTimeOfOrder).toLocaleString(
                          "en-IN"
                        )}
                        /item
                      </small>
                    </span>
                    <strong>
                      ₹{Number(lineTotal).toLocaleString("en-IN")}
                    </strong>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <hr />
            <div className="d-flex justify-content-between h5 mt-3">
              <span>Total Price:</span>
              <strong>
                ₹{Number(selectedOrder.TotalPrice).toLocaleString("en-IN")}
              </strong>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Update Order Status  */}
      {selectedOrderForStatus && (
        <Modal show={showStatusModal} onHide={handleCloseStatusModal} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
              Update Status for Order #{selectedOrderForStatus.OrderID}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleStatusUpdate}>
            <Modal.Body className="bg-dark text-white">
              <Form.Group>
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
              <Button variant="secondary" onClick={handleCloseStatusModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
