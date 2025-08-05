import React from "react";
import { useLocation } from "react-router-dom";
import { Offcanvas, Tabs, Tab } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import ProfileDetails from "./ProfileDetails"; 
import AddressManager from "./AddressManager"; 
import "./ProfileOffcanvas.css";

const ProfileOffcanvas = ({ show, handleClose }) => {
  const { user } = useAuth();
  const location = useLocation();

   const defaultTab = location.state?.tab || "profile";


  if (!user) {
    return null;
  }

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      className="glass-modal"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>My Account</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Tabs
          defaultActiveKey={defaultTab}
          id="account-tabs"
          className="mb-3"
          justify
        >
          <Tab eventKey="profile" title="My Profile">
            <ProfileDetails />
          </Tab>
          <Tab eventKey="addresses" title="My Addresses">
            <AddressManager />
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProfileOffcanvas;
