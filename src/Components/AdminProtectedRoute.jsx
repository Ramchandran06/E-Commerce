import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  console.log("AdminProtectedRoute is running...");
  console.log("Current user object:", user);

   if (!user || user.Role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  if (user) {
    return <Outlet />;
  }


  
//   if (!user || user.role !== "admin") {
    
//     return <Navigate to="/" replace />;
//   }

 
//   return <Outlet />;
};

export default AdminProtectedRoute;
