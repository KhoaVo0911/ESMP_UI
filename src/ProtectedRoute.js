import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if accessToken is present in sessionStorage
  const accessToken = sessionStorage.getItem('accessToken');

  // If no accessToken, redirect to login page
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // If accessToken exists, render the children (the protected route)
  return children;
};

export default ProtectedRoute;
