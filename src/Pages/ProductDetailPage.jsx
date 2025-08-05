import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Badge,
  Breadcrumb,
  Form,
  Card,
} from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import "animate.css";
import "./ProductDetailPage.css";

// ReviewsTab
const ReviewsTab = ({ productId, onReviewsLoad }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reviews/${productId}`);
      setReviews(response.data);
      onReviewsLoad(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [productId, onReviewsLoad]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a review.");
    if (rating === 0) return toast.error("Please select a star rating.");
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/reviews/${productId}`, {
        rating,
        comment,
      });
      toast.success(response.data.message);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <Card
            key={review.ReviewID}
            className="bg-transparent border-secondary mb-3"
          >
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title className="text-white">
                  {review.FullName}
                </Card.Title>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < review.Rating ? "#ffc107" : "#444"}
                    />
                  ))}
                </div>
              </div>
              <Card.Text className="text-white-50 mt-2">
                {review.Comment}
              </Card.Text>
              <Card.Footer className="text-secondary bg-transparent border-0 px-0 pt-2">
                {new Date(review.CreatedAt).toLocaleDateString()}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-white-50">No reviews yet for this product.</p>
      )}

      {user && (
        <>
          <hr
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
            className="my-4"
          />
          <h5 className="text-white">Write a Review</h5>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3 text-start">
              <Form.Label>Your Rating</Form.Label>
              <div>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={24}
                    className="me-1 star-rating"
                    style={{ color: i < rating ? "#ffc107" : "#e4e5e9" }}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Share your experience with this product..."
                className="bg-transparent text-white custom-form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" size="sm" /> : "Submit Review"}
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

// Main ProductDetailPage
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.Thumbnail);
      } catch (err) {
        setError("Product not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  if (error || !product)
    return (
      <Container className="my-5 py-5">
        <Alert variant="danger">
          {error || "Could not load product details."}
        </Alert>
      </Container>
    );

  const price = Number(product.Price) || 0;
  const discount = Number(product.DiscountPercentage) || 0;
  const stock = Number(product.Stock) || 0;

  const averageRating = Number(product.Rating) || 0;

  const imageGallery = product.ImagesJSON
    ? JSON.parse(product.ImagesJSON)
    : [product.Thumbnail];
  const discountedPrice = Math.round(price * (1 - discount / 100));

  const handleAddToCart = () => addToCart(product, quantity);
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };
  const increaseQuantity = () => setQuantity((q) => Math.min(stock, q + 1));
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <Container className="my-5 py-5 text-white product-detail-container">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
          Products
        </Breadcrumb.Item>
        <Breadcrumb.Item className="text-white" active>
          {product.Name}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gy-5 mt-2">
        {/* Image Gallery Column */}
        <Col lg={6} className="animate__animated animate__fadeInLeft">
          <div className="main-image-wrapper">
            <Image
              src={selectedImage}
              alt={product.Name}
              className="main-image"
              fluid
            />
          </div>
          {/* {imageGallery.length > 1 && (
            <div className="film-strip-gallery">
              {imageGallery.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail-image ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )} */}
        </Col>

        {/* Product Details Column */}
        <Col
          lg={6}
          className="animate__animated animate__fadeInRight"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="details-glass-card">
            <Badge
              pill
              bg="secondary"
              className="mb-3 product-category-badge align-self-start"
            >
              {product.Category}
            </Badge>
            <h1 className="product-title-detail">{product.Name}</h1>
            <div
              className="d-flex align-items-center my-3"
              style={{ minHeight: "28px" }}
            >
              {reviews.length > 0 ? (
                <>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={
                          i < Math.round(averageRating) ? "#ffc107" : "#6c757d"
                        }
                        className="me-1"
                      />
                    ))}
                    <span className="fw-bold ms-2">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <a
                    href="#reviews"
                    className="ms-3 text-white-50 text-decoration-none"
                  >
                    ({reviews.length}{" "}
                    {reviews.length > 1 ? "ratings" : "rating"})
                  </a>
                </>
              ) : (
                <span className="text-white-50" style={{ fontStyle: "italic" }}>
                  Be the first to review this product!
                </span>
              )}
            </div>
            <h2 className="my-3 product-price-detail">
              ₹{discountedPrice.toLocaleString("en-IN")}
              {discount > 0 && (
                <span className="text-secondary text-decoration-line-through fs-5 ms-3 original-price">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              )}
            </h2>
            <p className="description-preview text-white-50">
              {product.Description.substring(0, 150)}...
            </p>

            <ListGroup variant="flush" className="my-3">
              <ListGroup.Item className="bg-transparent d-flex justify-content-between text-white border-secondary px-0">
                <span>Status:</span>
                <span className={stock > 0 ? "text-success" : "text-danger"}>
                  {stock > 10
                    ? "In Stock"
                    : stock > 0
                    ? `Hurry! Only ${stock} left!`
                    : "Out Of Stock"}
                </span>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent d-flex justify-content-between align-items-center text-white border-secondary px-0 py-3">
                <span>Quantity:</span>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                  >
                    <FaPlus />
                  </button>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <div className="d-flex gap-3 mt-4">
              <Button
                variant="outline-light"
                size="lg"
                className="w-100 action-btn"
                disabled={stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-100 action-btn"
                disabled={stock === 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Row className="mt-5 pt-5" id="reviews">
        <Col>
          <div className="glass-card tabs-glass-card">
            <Tabs
              defaultActiveKey="description"
              id="product-info-tabs"
              className="product-tabs mb-4"
              justify
            >
              {/* Description Tab */}
              <Tab eventKey="description" title="Description">
                <p className="mt-3 text-white-50">{product.Description}</p>
              </Tab>

              {/* Additional Information Tab */}
              <Tab eventKey="additionalInfo" title="Additional Information">
                <ListGroup variant="flush" className="mt-3">
                  <ListGroup.Item className="bg-transparent d-flex justify-content-between text-white border-secondary px-0 py-2">
                    <strong>Brand:</strong>
                    <span>{product.Brand || "Unbranded"}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent d-flex justify-content-between text-white border-secondary px-0 py-2">
                    <strong>Category:</strong>
                    <span>{product.Category}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent d-flex justify-content-between text-white border-secondary px-0 py-2">
                    <strong>Items In Stock:</strong>
                    <span>{stock} units</span>
                  </ListGroup.Item>
                </ListGroup>
              </Tab>

              {/* Reviews Tab */}
              <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
                <ReviewsTab productId={id} onReviewsLoad={setReviews} />
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
