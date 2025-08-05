import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Container, Row, Col, Nav, Button, Offcanvas } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaPlusCircle,
  FaEnvelopeOpenText,
  FaQuestionCircle,
  FaUndo,
  FaBars,
} from "react-icons/fa";
import "./AdminLayout.css";


const SidebarContent = ({ onLinkClick }) => (
  <>
    <h3 className="text-white text-center my-3">Admin Panel</h3>
    <Nav className="flex-column">
     
      <Link to="/admin" className="nav-link" onClick={onLinkClick}>
        <FaTachometerAlt className="me-2" /> Dashboard
      </Link>
      <Link to="/admin/products" className="nav-link" onClick={onLinkClick}>
        <FaBox className="me-2" /> Products
      </Link>
      <Link to="/admin/add-product" className="nav-link" onClick={onLinkClick}>
        <FaPlusCircle className="me-2" /> Add Product
      </Link>
      <Link to="/admin/orders" className="nav-link" onClick={onLinkClick}>
        <FaShoppingCart className="me-2" /> Orders
      </Link>
      <Link to="/admin/messages" className="nav-link" onClick={onLinkClick}>
        <FaEnvelopeOpenText className="me-2" /> Messages
      </Link>
      <Link to="/admin/faq" className="nav-link" onClick={onLinkClick}>
        <FaQuestionCircle className="me-2" /> FAQ
      </Link>
      <Link to="/admin/returns" className="nav-link" onClick={onLinkClick}>
        <FaUndo className="me-2" /> Returns
      </Link>
    </Nav>
  </>
);

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div className="admin-wrapper">
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="admin-sidebar d-none d-md-block">
            <SidebarContent />
          </Col>

          <Col md={9} lg={10} className="admin-content">
            <Button
              variant="outline-light"
              onClick={handleShow}
              className="d-md-none m-3"
            >
              <FaBars /> Menu
            </Button>
            <div className="p-4">
              {" "}
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>

      {/* 3. Offcanvas Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={handleClose}
        responsive="md"
        className="admin-sidebar d-lg-none"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent onLinkClick={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default AdminLayout;
