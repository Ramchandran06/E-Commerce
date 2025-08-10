import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const FaqManagementPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    question: "",
    answer: "",
    isActive: true,
    displayOrder: 0,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("/api/faq/admin/all", config);
      setFaqs(response.data);
    } catch (err) {
      setError("Failed to fetch FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleShowModal = (faq = null) => {
    if (faq) {
      setIsEditing(true);
      setCurrentFaq(faq);
    } else {
      setIsEditing(false);
      setCurrentFaq({
        question: "",
        answer: "",
        isActive: true,
        displayOrder: faqs.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentFaq((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Authentication required. Please log in again.");
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const payload = {
      Question: currentFaq.question,
      Answer: currentFaq.answer,
      IsActive: currentFaq.isActive,
      DisplayOrder: Number(currentFaq.displayOrder),
    };
    const apiCall = isEditing
      ? axios.put(`/api/faq/${currentFaq.faqid}`, payload, config)
      : axios.post("/api/faq", payload, config);

    try {
      const response = await apiCall;
      toast.success(response.data.message);
      fetchFaqs();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.delete(`/api/faq/${id}`, config);
        toast.success(response.data.message);
        fetchFaqs();
      } catch (err) {
        toast.error("Failed to delete FAQ.");
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage FAQs</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" /> Add New FAQ
        </Button>
      </div>
      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Question</th>
            <th>Status</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq.faqid}>
              <td>{faq.question}</td>
              <td>{faq.isActive ? "Active" : "Inactive"}</td>
              <td>{faq.displayOrder}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(faq)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(faq.faqid)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{isEditing ? "Edit FAQ" : "Add New FAQ"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={currentFaq.question}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="answer"
                value={currentFaq.answer}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="displayOrder"
                value={currentFaq.displayOrder}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              id="is-active-switch"
              name="isActive"
              label="Is Active"
              checked={currentFaq.isActive}
              onChange={handleInputChange}
            />
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
    </div>
  );
};

export default FaqManagementPage;
