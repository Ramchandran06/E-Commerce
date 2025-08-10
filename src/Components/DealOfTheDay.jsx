import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import axios from "axios";
import "./DealOfTheDay.css";

const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
  <div className="countdown-container">
    <div className="countdown-box">
      <div className="countdown-value">{days}</div>
      <div className="countdown-label">Days</div>
    </div>
    <div className="countdown-box">
      <div className="countdown-value">{hours}</div>
      <div className="countdown-label">Hours</div>
    </div>
    <div className="countdown-box">
      <div className="countdown-value">{minutes}</div>
      <div className="countdown-label">Mins</div>
    </div>
    <div className="countdown-box">
      <div className="countdown-value">{seconds}</div>
      <div className="countdown-label">Secs</div>
    </div>
  </div>
);

const DealOfTheDay = () => {
  const [dealProduct, setDealProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDealProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/deal-of-the-day");
        if (response.data && response.data.productid) {
          setDealProduct(response.data);
        } else {
          setError("Deal of the day product not found.");
        }
      } catch (err) {
        setError("Deal of the day is currently unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchDealProduct();
  }, []);

  const getDealEndTime = () => {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    return endOfDay;
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  if (error || !dealProduct || typeof dealProduct.price !== "number") {
    return null;
  }

  const price = Number(dealProduct.price) || 0;
  const discount = Number(dealProduct.discountpercentage) || 0;
  const newPrice = Math.round(price * (1 - discount / 100));

  return (
    <Container className="my-5">
      <section className="deal-section">
        <Row className="g-0 align-items-center">
          <Col md={6} className="deal-image-col">
            <img
              src={dealProduct.thumbnail}
              alt={dealProduct.name}
              className="deal-image"
            />
          </Col>

          <Col md={6} className="deal-content-col">
            <div className="deal-content">
              <Badge  className="badge-deal mb-3">
                DEAL OF THE DAY
              </Badge>
              <h2 className="deal-title">{dealProduct.name}</h2>
              <p className="deal-description lead">
                {dealProduct.description
                  ? dealProduct.description.substring(0, 120) + "..."
                  : ""}
              </p>

              <Countdown date={getDealEndTime()} renderer={CountdownRenderer} />

              <div className="deal-price my-4">
                {discount > 0 && (
                  <span className="old-price text-decoration-line-through me-3">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                )}
                <strong>₹{newPrice.toLocaleString("en-IN")}</strong>
              </div>

              <Link to={`/product/${dealProduct.productid}`}>
                <Button variant="primary" size="lg" className="deal-button">
                  Shop Now →
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default DealOfTheDay;
