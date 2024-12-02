import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login";

const LoginPage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [hostId, setHostId] = useState("");
  const [hostCode, setHostCode] = useState("default"); // Default hostCode
  const [staffId, setStaffId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (token, userInfo) => {
    // Cập nhật các trạng thái và lưu vào sessionStorage
    setAccessToken(token);
    setIsLoggedIn(true);

    const hostCodeValue = userInfo.hostInfo ? userInfo.hostInfo.hostCode : "";
    setHostCode(hostCodeValue); // Cập nhật hostCode từ userInfo
    const vendorCode = userInfo.vendorInfo ? userInfo.vendorInfo.vendorId : "";
    const vendorName = userInfo.vendorInfo
      ? userInfo.vendorInfo.vendorName
      : "";
    const urlQrVendor = userInfo.vendorInfo ? userInfo.vendorInfo.urlQr : "";
    const urlQrHost = userInfo.hostInfo ? userInfo.hostInfo.urlQr : "";
    const hostIdValue = userInfo.hostInfo ? userInfo.hostInfo.hostId : "";
    const staffIdValue = userInfo.staffInfo ? userInfo.staffInfo.staffId : "";
    const staffName = userInfo.staffInfo ? userInfo.staffInfo.staffName : "";
    const userRole = userInfo.role || "host";

    setVendorId(vendorCode);
    setHostId(hostIdValue);
    setStaffId(staffIdValue);

    // Lưu thông tin vào sessionStorage cho cả Vendor và Host
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("hostId", hostIdValue); // Thêm thông tin hostId
    sessionStorage.setItem("hostName", userInfo.hostInfo?.hostName || ""); // Thêm thông tin tên host
    sessionStorage.setItem("vendorId", vendorCode);
    sessionStorage.setItem("vendorName", vendorName);
    sessionStorage.setItem("urlQrVendor", urlQrVendor); // Lưu URL QR của Vendor
    sessionStorage.setItem("urlQrHost", urlQrHost); // Lưu URL QR của Host
    sessionStorage.setItem("staffId", staffIdValue);
    sessionStorage.setItem("staffName", staffName);
    sessionStorage.setItem("role", userRole);

    // Điều hướng dựa trên vai trò của người dùng
    if (userRole === "admin") {
      navigate("/dashboard-admin", {
        state: { accessToken: token, vendorId: vendorCode },
      });
    } else if (userRole === "manager") {
      navigate(`/${vendorCode}/dashboardVendor`, {
        state: { accessToken: token, vendorId: vendorCode },
      });
    } else if (userRole === "host") {
      navigate(`/${hostIdValue}/dashboard`, {
        state: {
          accessToken: token,
          hostId: hostCodeValue,
        },
      });
    } else if (userRole === "staff") {
      navigate(`/eventStaff/${vendorCode}/${staffIdValue}`, {
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

  // Nếu đã đăng nhập, tự động điều hướng đến trang Dashboard
  useEffect(() => {
    if (isLoggedIn && hostId) {
      navigate(`/${hostId}/dashboard`);
    }
  }, [isLoggedIn, hostId, navigate]);

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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../shared/auth/AuthContext";
// import LoginComponent from "./Login";

// const LoginPage = () => {
//   const { login } = useAuth(); // Lấy hàm login từ AuthContext
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginSuccess = (token, userInfo) => {
//     // Xử lý thông tin người dùng và lưu vào AuthContext
//     const userData = {
//       accessToken: token,
//       userId: userInfo.userid,
//       vendorId: userInfo.vendorInfo?.vendorId || null,
//       vendorName: userInfo.vendorInfo?.vendorName || null,
//       urlQr: userInfo.vendorInfo?.urlQr || null,
//       hostId: userInfo.hostInfo?.hostId || null,
//       staffId: userInfo.staffInfo?.staffId || null,
//       staffName: userInfo.staffInfo?.staffName || null,
//       role: userInfo.role || "host",
//     };

//     login(userData); // Lưu thông tin vào AuthContext
//     setIsLoggedIn(true);

//     // Điều hướng dựa trên vai trò
//     switch (userData.role) {
//       case "admin":
//         navigate("/admin", { state: { accessToken: token } });
//         break;
//       case "manager":
//         navigate("/DashboardVendor", { state: { accessToken: token } });
//         break;
//       case "host":
//         navigate("/dashboard", { state: { accessToken: token } });
//         break;
//       case "staff":
//         navigate("/eventStaff", { state: { accessToken: token } });
//         break;
//       default:
//         console.error("Unknown role:", userData.role);
//         navigate("/");
//         break;
//     }
//     console.log(userData, "role");
//   };

//   return (
//     <div>
//       {!isLoggedIn ? (
//         <LoginComponent onLoginSuccess={handleLoginSuccess} />
//       ) : (
//         <div>
//           <h2>Welcome back!</h2>
//           <p>You are now logged in.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;
