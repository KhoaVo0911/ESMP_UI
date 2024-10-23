import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login"; // Ensure this points to the correct file

const LoginPage = () => {
  const [accessToken, setAccessToken] = useState(""); // Store accessToken after login
  const [vendorId, setVendorId] = useState(""); // Store vendorId after login
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check login status
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const handleLoginSuccess = (token, userInfo) => {
    setAccessToken(token); // Save accessToken
    setVendorId(userInfo.vendorInfo.vendorId); // Save vendorId from userInfo
    setIsLoggedIn(true); // Mark as logged in
  
    const userRole = userInfo.role; // Get user role from the response
  
    // Navigate based on the role returned from the API
    if (userRole === "admin") {
      navigate("/admin", { state: { accessToken: token, vendorId: userInfo.vendorInfo.vendorId } });
    } else if (userRole === "manager") {
      navigate("/DashboardVendor", { state: { accessToken: token, vendorId: userInfo.vendorInfo.vendorId } });
    } else if (userRole === "host") {
      navigate("/dashboard", { state: { accessToken: token, vendorId: userInfo.vendorInfo.vendorId } });
    } else {
      // Optional: Handle unknown roles
      console.error("Unknown role:", userRole);
      navigate("/", { state: { accessToken: token, vendorId: userInfo.vendorInfo.vendorId } }); // Or redirect to a default page
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <h2>Welcome, Vendor ID: {vendorId}</h2>
          <p>You are now logged in with access token: {accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
