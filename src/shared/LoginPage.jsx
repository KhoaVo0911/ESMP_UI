import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login";

const LoginPage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (token, userInfo) => {
    setAccessToken(token);
    sessionStorage.setItem("accessToken", token);

    const hostCode = userInfo.hostInfo ? userInfo.hostInfo.hostCode : "";
    setVendorId(hostCode);

    setIsLoggedIn(true);

    const userRole = userInfo.role || "host";

    if (userRole === "admin") {
      navigate("/admin", { state: { accessToken: token, vendorId: hostCode } });
    } else if (userRole === "manager") {
      navigate("/DashboardVendor", {
        state: { accessToken: token, vendorId: hostCode },
      });
    } else if (userRole === "host") {
      const hostId = userInfo.hostInfo ? userInfo.hostInfo.hostId : "";
      sessionStorage.setItem("hostId", hostId);

      navigate("/dashboard", {
        state: { accessToken: token, vendorId: hostCode, hostId: hostId },
      });
    } else {
      console.error("Unknown role:", userRole);
      navigate("/", { state: { accessToken: token, vendorId: hostCode } });
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
