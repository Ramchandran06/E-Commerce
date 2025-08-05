import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  const noHeaderFooterRoutes = ["/login", "/signup", "/forgot-password"];


  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);


  const mainStyle = {
    paddingTop: showHeaderFooter ? "80px" : "0",
    minHeight: "80vh",
  };

  return (
    <>
     
      {showHeaderFooter && <Header />}
      <main style={mainStyle}>{children}</main>
     
      {showHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
