import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";

const ProfilePage = () => {
  const context = useOutletContext();
  const handleProfileOpen = context ? context.handleProfileOpen : null;

  useEffect(() => {
    if (handleProfileOpen) {
      handleProfileOpen();
    }
  }, [handleProfileOpen]);

  return (
    <Container className="my-5 py-5 text-center text-white">
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaUserCog size={80} className="mb-4 text-primary" />

        <h1 className="fw-bold">My Account</h1>
        <p className="lead text-white-50 mb-4">
          Your account details are shown in the side panel. <br />
          You can manage your profile, addresses, and view your order history
          from there.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={handleProfileOpen}
          disabled={!handleProfileOpen}
        >
          Re-open Account Panel
        </Button>
      </div>
    </Container>
  );
};

export default ProfilePage;
