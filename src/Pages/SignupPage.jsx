import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateMobile = (mobileNumber) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobileNumber);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateMobile(formData.mobile)) {
      return toast.error("Please enter a valid 10-digit mobile number.");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await signup(formData);
      await login({
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! Welcome!");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create an account.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="signup-glass-card animate__animated animate__fadeIn">
              <div className="text-center mb-5">
                <h2 className="fw-bold">Create Your Account</h2>
              </div>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    size="lg"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    size="lg"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    placeholder="Enter 10-digit mobile no"
                    size="lg"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Min. 6 characters"
                    size="lg"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    size="lg"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  id="terms-check"
                  className="mb-4"
                  required
                  label={
                    <span className="text-white-50 terms-link">
                      I agree to the <Link to="/terms">Terms of Service</Link>{" "}
                      and <Link to="/policy">Privacy Policy</Link>.
                    </span>
                  }
                />
                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="action-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </Form>
              <div className="mt-4 text-center">
                <p className="mb-0 text-white-50">
                  Already have an account?{" "}
                  <Link to="/login" className="fw-bold text-primary">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupPage;
