import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  FloatingLabel,
  Accordion,
} from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import "./ContactPage.css";
import "animate.css";
import axios from "axios";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqError, setFaqError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setFaqLoading(true);
        const response = await axios.get("/api/faq");
        setFaqs(response.data);
      } catch (error) {
        setFaqError("Could not load Frequently Asked Questions at the moment.");
        console.error("Fetch FAQs Error:", error);
      } finally {
        setFaqLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/contact/submit", formData);
      toast.success(response.data.message);
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 ">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-white">Connect With Us</h1>
        <p className="lead text-white-50">
          We're here to help with any questions or inquiries you may have.
        </p>
      </div>

      <Row className="gy-4">
        <Col lg={7} className="animate__animated animate__fadeInLeft">
          <div className="contact-card h-100">
            <h3 className="mb-4 text-white">Send a Message</h3>
            <Form onSubmit={submitHandler}>
              <FloatingLabel
                controlId="fullName"
                label="Full Name"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="email"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="subject"
                label="Subject"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Order Inquiry"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="message"
                label="Message"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a message here"
                  style={{ height: "150px" }}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
              <div className="d-grid mt-5">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? <Spinner as="span" size="sm" /> : "Send Message"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col
          lg={5}
          className="animate__animated animate__fadeInRight"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="contact-card h-100">
            <h3 className="mb-4 text-white">Contact Information</h3>
            <div className="contact-info-item d-flex mb-3">
              <FaMapMarkerAlt size={20} className="me-3 mt-1" />
              <div>
                <strong>Address:</strong>
                <br />
                123 Fashion Street, Chennai, TN
              </div>
            </div>
            <div className="contact-info-item d-flex mb-3">
              <FaEnvelope size={20} className="me-3 mt-1" />
              <div>
                <strong>Email:</strong>
                <br />
                support@sitdressshop.com
              </div>
            </div>
            <div className="contact-info-item d-flex mb-3">
              <FaPhone size={20} className="me-3 mt-1" />
              <div>
                <strong>Phone:</strong>
                <br />
                +91 98765 43210
              </div>
            </div>

            <div className="contact-info-item d-flex mb-4">
              <FaClock size={20} className="me-3 mt-1" />
              <div>
                <strong>Opening Hours:</strong>
                <br />
                Mon - Sat: 10:00 AM - 9:00 PM
              </div>
            </div>

            <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

            <h4 className="mt-4 mb-3 text-white">Frequently Asked Questions</h4>
            {faqLoading && (
              <div className="text-center">
                <Spinner animation="border" size="sm" variant="light" />
              </div>
            )}
            {faqError && (
              <Alert variant="warning" size="sm">
                {faqError}
              </Alert>
            )}

            {!faqLoading && !faqError && faqs.length > 0 && (
              <Accordion defaultActiveKey="0" flush className="faq-accordion">
                {faqs.map((faq, index) => (
                  <Accordion.Item key={faq.FAQID} eventKey={String(index)}>
                    <Accordion.Header>{faq.Question}</Accordion.Header>
                    <Accordion.Body>{faq.Answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
            {!faqLoading && !faqError && faqs.length === 0 && (
              <p className="text-white-50">No FAQs available at the moment.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
