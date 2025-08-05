import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <footer className="footer-container">
        <Container>
          <Row className="gy-4">
            <Col lg={6} md={6}>
              <h5>SIT Dress Shop</h5>
              <p>
                Your one-stop destination for the latest trends in fashion. We
                bring you quality apparel at affordable prices, blending
                tradition with modern style.
              </p>
              <div className="footer-social-icons mt-3">
                <a href="#" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </Col>

            <Col lg={3} md={6} >
              <h5>Quick Links</h5>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/products">Shop</Link>
                </li>
                <li>
                  <Link to="/contact">FAQ</Link>
                </li>
              </ul>
            </Col>

            <Col lg={3} md={6}>
              <h5>Contact Info</h5>
              <div className="footer-contact-info ">
                <p>
                  <FaMapMarkerAlt /> 123 Fashion St, Chennai
                </p>
                <p>
                  <FaEnvelope /> support@sitdress.com
                </p>
                <p>
                  <FaPhone /> +91 98765 43210
                </p>
              </div>
            </Col>

            {/* Newsletter */}
            {/* <Col lg={3} md={6}>
              <h5>Stay Updated</h5>
              <p>
                Subscribe to our newsletter for the latest deals and new
                arrivals.
              </p>
              <Form className="newsletter-form d-flex">
                <Form.Control
                  type="email"
                  placeholder="Your Email"
                  className="me-2"
                />
                <Button variant="primary" type="submit">
                  Go
                </Button>
              </Form>
            </Col> */}
          </Row>
        </Container>
      </footer>

      {/* Bottom Bar - Copyright */}
      <div className="bottom-bar text-center">
        © {new Date().getFullYear()} SIT Dress Shop. Designed by Developer.
      </div>
    </div>
  );
};

export default Footer;
