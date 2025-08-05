import React, {useState} from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  
  const [step, setStep] = useState(1); 


  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      setStep(2); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

 
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      const payload = { email, otp, newPassword };
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", payload);
      toast.success(response.data.message);
      navigate("/login"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="forgot-password-card animate__animated animate__fadeIn">
              <div className="forgot-password-icon">
                <FaLock />
              </div>

          
              {step === 1 ? (
                <>
                  <h2 className="fw-bold mb-3">Forgot Your Password?</h2>
                  <p className="text-white-50 mb-4">
                    Enter your email address below and we will send you an OTP to reset your password.
                  </p>
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-4" controlId="formResetEmail">
                      <Form.Control type="email" placeholder="Enter your registered email" size="lg" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" className="action-btn" disabled={loading}>
                        {loading ? <Spinner as="span" size="sm" /> : "Send OTP"}
                      </Button>
                    </div>
                  </Form>
                </>
              ) : (
                <>
                  <h2 className="fw-bold mb-3">Reset Your Password</h2>
                  <p className="text-white-50 mb-4">
                    An OTP has been sent to <strong>{email}</strong>. Please enter it below.
                  </p>
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control type="text" placeholder="Enter the 6-digit OTP" size="lg" required value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter new password" size="lg" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control type="password" placeholder="Confirm new password" size="lg" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" className="action-btn" disabled={loading}>
                        {loading ? <Spinner as="span" size="sm" /> : "Reset Password"}
                      </Button>
                    </div>
                  </Form>
                </>
              )}

              <div className="mt-4">
                <Link to="/login" className="text-white-50">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;