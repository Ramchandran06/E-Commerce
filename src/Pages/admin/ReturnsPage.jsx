import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");

 const fetchReturns = async () => {
   try {
     setLoading(true);
     const response = await axios.get("/api/returns/admin/all", {
       params: { page: currentPage, limit: 10 },
     });
     setReturns(response.data.returns);
     setTotalPages(response.data.totalPages);
   } catch (err) {
     setError("Failed to fetch return requests.");
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    fetchReturns();
  }, [currentPage]);

  const handleShowModal = (returnRequest) => {
    setSelectedReturn(returnRequest);
    setNewStatus(returnRequest.ReturnStatus); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReturn(null);
    setAdminComment("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedReturn) return;

    try {
      const payload = { status: newStatus, adminComment };
      await axios.put(
        `/api/returns/admin/${selectedReturn.ReturnID}/status`,
        payload
      );
      toast.success("Return status updated successfully!");
      fetchReturns(); 
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "requested":
        return "warning";
      case "approved":
        return "info";
      case "refunded":
        return "success";
      case "rejected":
        return "danger";
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

  return (
    <div className="text-white">
      <h1 className="mb-4">Manage Returns</h1>
      {returns.length === 0 ? (
        <Alert variant="info">No return requests found.</Alert>
      ) : (
        <>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((req) => (
              <tr key={req.ReturnID}>
                <td>#{req.ReturnID}</td>
                <td>#{req.OrderID}</td>
                <td>{req.CustomerName}</td>
                <td>{req.ProductName}</td>
                <td>{req.Reason}</td>
                <td>
                  <Badge bg={getStatusBadge(req.ReturnStatus)}>
                    {req.ReturnStatus}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleShowModal(req)}
                  >
                    <FaEye /> Update Status
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
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link bg-dark text-white border-secondary'}
                    activeClassName={'active'}
                    disabledClassName={'disabled'}
                />
            </div>
          )}
        </>
      )}

      {/* Update Status Modal */}
      {selectedReturn && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
              Update Return Request #{selectedReturn.ReturnID}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleStatusUpdate}>
            <Modal.Body className="bg-dark text-white">
              <p>
                <strong>Customer:</strong> {selectedReturn.CustomerName}
              </p>
              <p>
                <strong>Product:</strong> {selectedReturn.ProductName}
              </p>
              <p>
                <strong>Reason:</strong> {selectedReturn.Reason}
              </p>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Change Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Requested">Requested</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Admin Comment (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
              <Button variant="secondary" onClick={handleCloseModal}>
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

export default ReturnsPage;
