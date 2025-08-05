import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import loginSideImage from "../assets/LoginImg.jpeg";
import toast from "react-hot-toast";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(credentials);
      navigate("/");
      toast.success("Logged in successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Link to="/" className="home-icon-login">
        <FaHome />
      </Link>
      <Container>
        <div className="login-glass-card">
          <Row className="g-0">
            <Col lg={6}>
              <div className="login-form-container">
                <div className="text-center mb-5">
                  <h2 className="fw-bold">Welcome Back!</h2>
                  <p className="text-white-50">
                    Sign in to continue to SIT Dress Shop
                  </p>
                </div>

                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      size="lg"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      size="lg"
                      required
                      value={credentials.password}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      id="remember-me-check"
                    />
                    <Link to="/forgot-password" className="text-light fw-bold">
                      Forgot password?
                    </Link>
                  </div>
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
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="mt-5 text-center">
                  <p className="mb-0 text-white-50">
                    Don't have an account?{" "}
                    <Link to="/signup" className="fw-bold text-light">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="login-image-container">
                <img
                  src={loginSideImage}
                  alt="Fashion visual"
                  className="login-image"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
