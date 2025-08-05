import React from "react";
import { Button, Badge, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlistItem } = useWishlist();

  if (!product) {
    return null;
  }

  const price = Number(product.Price) || 0;
  const discount = Number(product.DiscountPercentage) || 0;

  const avgRating = Number(product.AvgRating) || 0;
  const reviewCount = Number(product.ReviewCount) || 0;

  const newPrice = Math.round(price * (1 - discount / 100));

  const isWishlisted = wishlistItems.some(
    (item) => item.ProductID === product.ProductID
  );

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlistItem(product.ProductID);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigate("/cart");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= Math.round(ratingValue) ? "#ffc107" : "#6c757d"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="product-card-wrapper h-100" tabIndex="0">
      <div className="product-image-container">
        {discount > 0 && (
          <Badge bg="danger" className="product-tag">
            {`${Math.round(discount)}% OFF`}
          </Badge>
        )}

        <div
          className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
          onClick={handleToggleWishlist}
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </div>

        <Link to={`/product/${product.ProductID}`}>
          <img
            src={product.Thumbnail}
            alt={product.Name}
            className="product-img"
          />
        </Link>
      </div>

      <div className="product-info">
        <Link to={`/product/${product.ProductID}`} className="product-title">
          {product.Name}
        </Link>

        <div
          className="product-rating d-flex align-items-center"
          style={{ minHeight: "24px" }}
        >
          {reviewCount > 0 ? (
            <>
              
              {renderStars(avgRating)}
              <span
                className="ms-2 text-white-50"
                style={{ fontSize: "0.8rem" }}
              >
                ({avgRating.toFixed(1)})
              </span>
            </>
          ) : (
            <span
              className="text-muted"
              style={{ fontSize: "0.8rem", fontStyle: "italic" }}
            >
              No reviews yet
            </span>
          )}
        </div>

        <p className="product-price mb-5">
          <span className="fw-bold ">₹{newPrice.toLocaleString("en-IN")}</span>
          {discount > 0 && (
            <span
              className="text-secondary text-decoration-line-through ms-2"
              style={{ fontSize: "0.9rem" }}
            >
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
        </p>

        <div className="product-actions ">
          <Stack direction="horizontal" gap={2}>
            <Button
              variant="outline-light"
              size="sm"
              className="w-100"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-100"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
