import React, { useState, useEffect } from "react";
import {
  ListGroup,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AddressManager.css";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const initialFormState = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/addresses");
        setAddresses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Could not fetch addresses.");
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setFormData(initialFormState);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setFormData({ ...initialFormState, ...address });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingAddress) {
        response = await axios.put(
          `http://localhost:5000/api/addresses/update/${editingAddress.AddressID}`,
          formData
        );
        toast.success("Address updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:5000/api/addresses/add",
          formData
        );
        toast.success("Address added successfully!");
      }
      setAddresses(response.data.addresses);
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/addresses/delete/${addressId}`
        );
        setAddresses(response.data.addresses);
        toast.success("Address deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete address.");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Saved Addresses</h5>

        {!showForm && (
          <Button variant="outline-light" size="sm" onClick={handleAddNewClick}>
            + Add New Address
          </Button>
        )}
      </div>

      {showForm && (
        <Form onSubmit={handleSubmit} className="mb-4 glass-form p-3 rounded">
          <h6 className="mb-3">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h6>

          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Control
                  name="addressLine1"
                  placeholder="Address Line 1*"
                  required
                  onChange={handleInputChange}
                  value={formData.addressLine1}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Control
                  name="addressLine2"
                  placeholder="Address Line 2 (Optional)"
                  onChange={handleInputChange}
                  value={formData.addressLine2}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Control
                  name="city"
                  placeholder="City*"
                  required
                  onChange={handleInputChange}
                  value={formData.city}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Control
                  name="state"
                  placeholder="State*"
                  required
                  onChange={handleInputChange}
                  value={formData.state}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Control
                  name="postalCode"
                  placeholder="Postal Code*"
                  required
                  onChange={handleInputChange}
                  value={formData.postalCode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Control
                  name="country"
                  placeholder="Country*"
                  required
                  onChange={handleInputChange}
                  value={formData.country}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAddress ? "Save Changes" : "Save Address"}
            </Button>
          </div>
        </Form>
      )}

      {!showForm &&
        (addresses.length > 0 ? (
          <ListGroup>
            {addresses.map((addr) => (
              <ListGroup.Item key={addr.AddressID} className="address-card">
                <div>
                  <p className="fw-bold mb-1">{addr.AddressLine1}</p>
                  <p className="mb-0 text-white-50">
                    {addr.City}, {addr.State} - {addr.PostalCode}
                  </p>
                </div>
                <div className="address-card-actions">
                  <FaEdit onClick={() => handleEditClick(addr)} />
                  <FaTrash onClick={() => handleDelete(addr.AddressID)} />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info">You have no saved addresses.</Alert>
        ))}
    </div>
  );
};

export default AddressManager;
