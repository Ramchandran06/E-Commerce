import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";

const ResetPasswordPage = () => {
   console.log("--- ResetPasswordPage component has loaded! ---");
  const { token } = useParams();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
 


 const submitHandler = async (e) => {
   e.preventDefault();
   setError(null);

   if (newPassword.length < 6) {
     return setError("Password must be at least 6 characters long.");
   }
   if (newPassword !== confirmPassword) {
     return setError("Passwords do not match.");
   }

   setLoading(true);
   try {
     const response = await axios.put(`/api/auth/reset-password/${token}`, {
       newPassword,
     });
     toast.success(response.data.message || "Password reset successfully!");
     navigate("/login");
   } catch (err) {
     setError(
       err.response?.data?.message ||
         "An error occurred. The link may have expired."
     );
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="auth-layout-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h3 className="fw-bold">Set a New Password</h3>
                  <p className="text-white-50">
                    Enter and confirm your new password below.
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="new-password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="confirm-password">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <Spinner as="span" size="sm" />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-3">
                  <Link to="/login" className="back-to-login-link">
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
