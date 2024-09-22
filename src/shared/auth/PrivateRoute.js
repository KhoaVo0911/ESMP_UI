import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ component: Component, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

export default PrivateRoute;
