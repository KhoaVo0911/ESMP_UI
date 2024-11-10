import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login"; // Ensure this points to the correct file

const LoginPage = () => {
  const [accessToken, setAccessToken] = useState(""); // Store accessToken after login
  const [vendorId, setVendorId] = useState(""); // Store vendorId after login
  const [hostId, setHostId] = useState(""); // Store vendorId after login 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check login status
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const handleLoginSuccess = (token, userInfo) => {
    setAccessToken(token);
    setVendorId(userInfo.vendorInfo.vendorId);
    setIsLoggedIn(true);
    setHostId(userInfo.hostInfo.hostId);
  
    // Lưu accessToken, vendorName và urlQr vào sessionStorage
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("vendorId", userInfo.vendorInfo.vendorId);
    sessionStorage.setItem("vendorName", userInfo.vendorInfo.vendorName);
    sessionStorage.setItem("urlQr", userInfo.vendorInfo.urlQr);
    sessionStorage.setItem("hostId", userInfo.hostInfo.hostId);
  
    const userRole = userInfo.role;
  
    // Điều hướng dựa trên vai trò của người dùng
    if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "manager") {
      navigate("/DashboardVendor");
    } else if (userRole === "host") {
      navigate("/dashboard");
    } else {
      console.error("Unknown role:", userRole);
      navigate("/");
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
