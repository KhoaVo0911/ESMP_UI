// import React, { useEffect, useState } from "react";
// import { Layout, Menu } from "antd";
// import { useNavigate, useLocation } from "react-router-dom";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import EventIcon from "@mui/icons-material/Event";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FastfoodIcon from "@mui/icons-material/Fastfood";
// import PeopleIcon from "@mui/icons-material/People";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import logo from "../../../assets/images/trans_bg.png"; // Path to your logo

// const { Sider } = Layout;

// const VendorSideBar = ({ collapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedMenuItem, setSelectedMenuItem] = useState("1");
//   const accessToken = location.state?.accessToken || "";
//   const vendorId = location.state?.vendorId || "";
//   const defaultItems = [
//     {
//       type: "group",
//       label: <h3 style={{ fontWeight: "bold", color: "#A0AEC0" }}>MENU</h3>,
//       children: [
//         {
//           key: "1",
//           icon: <DashboardIcon />,
//           label: <span style={{ fontWeight: "bold" }}>Dashboard</span>,
//         },
//         {
//           key: "2",
//           icon: <FormatListBulletedIcon />,
//           label: <span style={{ fontWeight: "bold" }}>Products List</span>,
//         },
//         {
//           key: "3",
//           icon: <FastfoodIcon />,
//           label: (
//             <span style={{ fontWeight: "bold" }}>Manage Product Items</span>
//           ),
//         },
//         {
//           key: "4",
//           icon: <EventIcon />,
//           label: <span style={{ fontWeight: "bold" }}>Events</span>,
//         },
//         {
//           key: "5",
//           icon: <PeopleIcon />,
//           label: (
//             <span style={{ fontWeight: "bold" }}>Manage Staff Account</span>
//           ),
//         },
//         {
//           key: "6",
//           icon: <CheckCircleIcon />,
//           label: (
//             <span style={{ fontWeight: "bold" }}>List Event Enrolled</span>
//           ),
//         },
//       ],
//     },
//   ];

//   const handleMenuClick = (e) => {
//     setSelectedMenuItem(e.key);
//     switch (e.key) {
//       case "1":
//         navigate(`/${vendorId}/dashboardVendor`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       case "2":
//         navigate(`/productsList/${vendorId}`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       case "3":
//         navigate(`/manage-product/${vendorId}`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       case "4":
//         navigate(`/eventsVendor/${vendorId}`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       case "5":
//         navigate(`/staff-account-manager/${vendorId}`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       case "6":
//         navigate(`/ListEventEnrolled/${vendorId}`, {
//           state: { accessToken, vendorId },
//         });
//         break;
//       default:
//         navigate(`/${vendorId}/dashboardVendor`, {
//           state: { accessToken, vendorId },
//         });
//     }
//   };

//   return (
//     <>
//       <Sider
//         trigger={null}
//         collapsible
//         collapsed={collapsed}
//         style={{
//           backgroundColor: "#F7FAFC",
//           height: "100vh",
//           position: "fixed",
//           left: 0,
//           top: 0,
//           boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
//           overflow: "auto",
//         }}
//         width={250} // Adjusted the width for more space
//         collapsedWidth={80} // Adjusted collapsed width
//       >
//         <img
//           src={logo}
//           alt="logo"
//           style={{
//             width: collapsed ? "80px" : "180px",
//             transition: "width 0.3s ease",
//             margin: "16px auto",
//             display: "block",
//           }}
//         />
//         <Menu
//           style={{
//             backgroundColor: "#F7FAFC",
//             color: "#4A5568",
//             fontSize: "16px", // Increased font size
//           }}
//           mode="inline"
//           selectedKeys={[selectedMenuItem]}
//           onClick={handleMenuClick}
//           items={defaultItems}
//         />
//       </Sider>
//       <div
//         style={{
//           marginLeft: collapsed ? "80px" : "250px", // Adjusted margin based on the width of the Sider
//           transition: "margin-left 0.3s ease",
//           padding: "12px",
//         }}
//       >
//         {/* Content will be displayed here */}
//       </div>
//     </>
//   );
// };

// export default VendorSideBar;

import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import logo from "../../../assets/images/trans_bg.png"; // Đường dẫn tới logo của bạn

const { Sider } = Layout;

const VendorSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorId = sessionStorage.getItem("vendorId"); // Lấy vendorId từ sessionStorage
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Cập nhật menuItem được chọn dựa trên URL hiện tại
  useEffect(() => {
    if (location.pathname.startsWith(`/${vendorId}/dashboardVendor`)) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith(`/productsList`)) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith(`/manage-product`)) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith(`/eventsVendor`)) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith(`/staff-account-manager`)) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith(`/ListEventEnrolled`)) {
      setSelectedMenuItem("6");
    }
  }, [location.pathname, vendorId]);

  const defaultItems = [
    {
      type: "group",
      label: (
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#A0AEC0" }}>
          Menu
        </h3>
      ),
      children: [
        {
          key: "1",
          icon: <DashboardIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Dashboard
            </span>
          ),
          onClick: () => navigate(`/${vendorId}/dashboardVendor`),
        },
        {
          key: "2",
          icon: <FormatListBulletedIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Products List
            </span>
          ),
          onClick: () => navigate(`/productsList/${vendorId}`),
        },
        {
          key: "3",
          icon: <FastfoodIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Manage Product Items
            </span>
          ),
          onClick: () => navigate(`/manage-product/${vendorId}`),
        },
        {
          key: "4",
          icon: <EventIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Events
            </span>
          ),
          onClick: () => navigate(`/eventsVendor/${vendorId}`),
        },
        {
          key: "5",
          icon: <PeopleIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Manage Staff Account
            </span>
          ),
          onClick: () => navigate(`/staff-account-manager/${vendorId}`),
        },
        {
          key: "6",
          icon: <CheckCircleIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              List Event Enrolled
            </span>
          ),
          onClick: () => navigate(`/ListEventEnrolled/${vendorId}`),
        },
      ],
    },
  ];

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#fff",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          style={{
            width: collapsed ? "80px" : "180px",
            transition: "width 0.3s ease",
            margin: "16px auto",
            display: "block",
          }}
        />
        {/* Menu */}
        <Menu
          style={{
            backgroundColor: "#fff",
            color: "#1B2559",
          }}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          items={defaultItems}
        />
      </Sider>
      {/* Content margin based on sidebar */}
      <div
        style={{
          marginLeft: collapsed ? "80px" : "200px",
          transition: "margin-left 0.3s ease",
          padding: "12px",
        }}
      ></div>
    </>
  );
};

export default VendorSideBar;
