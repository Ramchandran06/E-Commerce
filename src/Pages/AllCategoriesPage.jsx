import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AllCategoriesPage.css";

const AllCategoriesPage = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://e-commerce-backend-o93z.onrender.com/api/products/categories/all"
        );

        setCategoriesData(response.data);
      } catch (err) {
        setError("Failed to fetch categories data. Please try again later.");
        console.error("Fetch Categories Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5 py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-white">Find Your Perfect Style</h1>
        <p className="lead text-white-50">
          Browse through our curated collections to find what you love.
        </p>
      </div>
      <Row className="gy-4">
        {categoriesData.map((category) => (
          <Col key={category.name} md={6} lg={4}>
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              className="text-decoration-none"
            >
              <div className="category-showcase-card">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />
                <div className="category-info-overlay">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="product-count">{category.count} Items</p>
                  <Button variant="primary" className="explore-button">
                    Explore
                  </Button>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllCategoriesPage;
