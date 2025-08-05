import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Spinner, Alert, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/contact");
      setMessages(response.data);
    } catch (err) {
      setError("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`/api/contact/${messageId}/read`);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.MessageID === messageId ? { ...msg, IsRead: true } : msg
        )
      );
    } catch (err) {
      toast.error("Could not update message status.");
    }
  };


  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.IsRead) {
      markAsRead(message.MessageID);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="text-white">
      <h1 className="mb-4">Contact Messages</h1>
      {messages.length === 0 ? (
        <Alert variant="info">You have no new messages.</Alert>
      ) : (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Received</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.MessageID} className={!msg.IsRead ? "fw-bold" : ""}>
                <td>{msg.FullName}</td>
                <td>{msg.Subject}</td>
                <td>{new Date(msg.ReceivedAt).toLocaleString()}</td>
                <td>
                  <Badge bg={msg.IsRead ? "secondary" : "success"}>
                    {msg.IsRead ? "Read" : "New"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleViewMessage(msg)}
                  >
                    <FaEye /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>{selectedMessage.Subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <p>
              <strong>From:</strong> {selectedMessage.FullName} (
              {selectedMessage.Email})
            </p>
            <p>
              <strong>Received:</strong>{" "}
              {new Date(selectedMessage.ReceivedAt).toLocaleString()}
            </p>
            <hr />
            <h6>Message:</h6>
            <p style={{ whiteSpace: "pre-wrap" }}>{selectedMessage.Message}</p>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default MessagesPage;
