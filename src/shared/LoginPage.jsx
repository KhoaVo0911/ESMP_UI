import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login";

const LoginPage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [hostId, setHostId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (token, userInfo) => {
    // Cập nhật các trạng thái và lưu vào sessionStorage
    setAccessToken(token);
    setIsLoggedIn(true);

    const hostCode = userInfo.hostInfo ? userInfo.hostInfo.hostCode : "";
    const vendorCode = userInfo.vendorInfo ? userInfo.vendorInfo.vendorId : "";
    const vendorName = userInfo.vendorInfo ? userInfo.vendorInfo.vendorName : "";
    const urlQr = userInfo.vendorInfo ? userInfo.vendorInfo.urlQr : "";
    const hostIdValue = userInfo.hostInfo ? userInfo.hostInfo.hostId : "";
    const staffIdValue = userInfo.staffInfo ? userInfo.staffInfo.staffId : "";
    const staffName = userInfo.staffInfo ? userInfo.staffInfo.staffName : "";
    const userRole = userInfo.role || "host";

    setVendorId(vendorCode);
    setHostId(hostIdValue);
    setStaffId(staffIdValue);

    // Lưu thông tin vào sessionStorage
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("vendorId", vendorCode);
    sessionStorage.setItem("vendorName", vendorName);
    sessionStorage.setItem("urlQr", urlQr);
    sessionStorage.setItem("hostId", hostIdValue);
    sessionStorage.setItem("staffId", staffIdValue);
    sessionStorage.setItem("staffName", staffName);
    sessionStorage.setItem("role", userRole);

    // Điều hướng dựa trên vai trò của người dùng
    if (userRole === "admin") {
      navigate("/admin", { state: { accessToken: token, vendorId: vendorCode } });
    } else if (userRole === "manager") {
      navigate("/DashboardVendor", {
        state: { accessToken: token, vendorId: vendorCode },
      });
    } else if (userRole === "host") {
      navigate("/dashboard", {
        state: { accessToken: token, vendorId: vendorCode, hostId: hostIdValue },
      });
    } else if (userRole === "staff") {
      navigate("/eventStaff", {
        state: {
          accessToken: token,
          vendorId: vendorCode,
          hostId: hostIdValue,
          staffId: staffIdValue,
        },
      });
    } else {
      console.error("Unknown role:", userRole);
      navigate("/", { state: { accessToken: token, vendorId: vendorCode } });
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
