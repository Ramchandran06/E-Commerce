import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../Components/ProductCard";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center text-white fw-bold mb-5">My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <Row>
          {wishlistItems.map((product) => (
            <Col key={product.ProductID} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          Your wishlist is empty. <Link to="/products">Explore products</Link>{" "}
          and add your favorites!
        </Alert>
      )}
    </Container>
  );
};

export default WishlistPage;
