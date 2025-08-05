import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";
import axios from "axios";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/search?q=${searchTerm}`
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

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
      <div className="mb-5">
        <h1 className="fw-bold text-white">
          Search Results for:{" "}
          <span className="text-primary">"{searchTerm}"</span>
        </h1>
        <p className="lead text-white-50">
          {searchResults.length} products found.
        </p>
      </div>

      <Row>
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <Col key={product.ProductID} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="warning">
              No products found matching your search term "{searchTerm}". Please
              try a different keyword.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SearchResultsPage;
