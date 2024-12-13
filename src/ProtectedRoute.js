// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   // Check if accessToken is present in sessionStorage
//   const accessToken = sessionStorage.getItem("accessToken");

//   // If no accessToken, redirect to login page
//   if (!accessToken) {
//     return <Navigate to="/login" />;
//   }

//   // If accessToken exists, render the children (the protected route)
//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const userRole = sessionStorage.getItem("role");

  // Kiểm tra nếu không có accessToken
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra nếu vai trò không khớp
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
