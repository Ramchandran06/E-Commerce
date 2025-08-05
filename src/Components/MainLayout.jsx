import React, { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProfileOffcanvas from "./ProfileOffcanvas"; 

import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();
    const location = useLocation();

  const handleProfileOpen = useCallback(() => setShowProfile(true), []);
  const handleProfileClose = () => setShowProfile(false);

  React.useEffect(() => {
    if (location.state?.openProfile) {
      handleProfileOpen();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleProfileOpen]);

 return (
   <>
     <Header handleProfileOpen={handleProfileOpen} />
     <main style={{ minHeight: "80vh" }}>
       <Outlet context={{ handleProfileOpen }} />
     </main>
     <Footer />
     {user && (
       <ProfileOffcanvas show={showProfile} handleClose={handleProfileClose} />
     )}
   </>
 );
};
export default MainLayout;
