import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"; 

const AddProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    Name: "",
    Brand: "",
    Description: "",
    Price: "",
    Stock: "",
    Category: "",
    Thumbnail: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newProduct = {
      ...productData,
      Price: Number(productData.Price),
      Stock: Number(productData.Stock),
      ImagesJSON: JSON.stringify([productData.Thumbnail]), 
    };

    try {
      await axios.post("/api/products", newProduct); 
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <div className="text-white">
      <h1 className="mb-4">Add New Product</h1>
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={productData.Name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="Brand"
                value={productData.Brand}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Description"
            value={productData.Description}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="Price"
                value={productData.Price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="Stock"
                value={productData.Stock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="Category"
                value={productData.Category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Thumbnail Image URL</Form.Label>
          <Form.Control
            type="text"
            name="Thumbnail"
            value={productData.Thumbnail}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Product
        </Button>
      </Form>
    </div>
  );
};

export default AddProductPage;
