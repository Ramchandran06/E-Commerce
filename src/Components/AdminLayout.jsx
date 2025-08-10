import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Button, Offcanvas } from "react-bootstrap";
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
    <h3 className="text-white text-center my-3 brand-title-admin">
     Admin Panel
    </h3>
    <div className="nav-container">
      <NavLink to="/admin" className="nav-link" onClick={onLinkClick} end>
        <FaTachometerAlt className="me-2" /> Dashboard
      </NavLink>
      <NavLink to="/admin/products" className="nav-link" onClick={onLinkClick}>
        <FaBox className="me-2" /> Products
      </NavLink>
      <NavLink
        to="/admin/add-product"
        className="nav-link"
        onClick={onLinkClick}
      >
        <FaPlusCircle className="me-2" /> Add Product
      </NavLink>
      <NavLink to="/admin/orders" className="nav-link" onClick={onLinkClick}>
        <FaShoppingCart className="me-2" /> Orders
      </NavLink>
      <NavLink to="/admin/messages" className="nav-link" onClick={onLinkClick}>
        <FaEnvelopeOpenText className="me-2" /> Messages
      </NavLink>
      <NavLink to="/admin/faq" className="nav-link" onClick={onLinkClick}>
        <FaQuestionCircle className="me-2" /> FAQ
      </NavLink>
      <NavLink to="/admin/returns" className="nav-link" onClick={onLinkClick}>
        <FaUndo className="me-2" /> Returns
      </NavLink>
    </div>
  </>
);

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div className="admin-wrapper d-flex">
      <Offcanvas
        show={showSidebar}
        onHide={handleClose}
        responsive="md"
        className="admin-sidebar"
        placement="start"
      >
        <Offcanvas.Header closeButton closeVariant="white"></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="sidebar-structure">
            <SidebarContent onLinkClick={handleClose} />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="admin-content-wrapper flex-grow-1">
        <Button
          variant="outline-light"
          onClick={handleShow}
          className="d-md-none m-3 mobile-menu-button"
        >
          <FaBars /> Menu
        </Button>

        <div className="p-4 outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
