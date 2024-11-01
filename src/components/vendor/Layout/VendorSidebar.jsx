import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PaidIcon from "@mui/icons-material/Paid";
import logo from "../../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const VendorSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Kiểm tra nếu location.state tồn tại, nếu không thì đặt giá trị mặc định
  const accessToken = location.state?.accessToken || ""; // Nếu không có state thì dùng chuỗi rỗng
  const vendorId = location.state?.vendorId || ""; // Nếu không có state thì dùng chuỗi rỗng

  useEffect(() => {
    if (location.pathname.startsWith("/dashboardVendor")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/productSample")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/ManageProductItems")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/eventsVendor")) {
      setSelectedMenuItem("4");
    } 
  }, [location.pathname]);

  const defaultItems = [
    {
      type: "group",
      label: <h3 style={{ fontWeight: "bold", color: "#A0AEC0" }}>MENU</h3>,
      children: [
        {
          key: "1",
          icon: <DashboardIcon />,
          label: <span style={{ fontWeight: "bold" }}>Dashboard</span>,
        },
        {
          key: "2",
          icon: <FormatListBulletedIcon />,
          label: <span style={{ fontWeight: "bold" }}>Products List</span>,
        },
        {
          key: "3",
          icon: <FastfoodIcon />,
          label: <span style={{ fontWeight: "bold" }}>Manage Product Items</span>,
        },
        {
          key: "4",
          icon: <EventIcon />,
          label: <span style={{ fontWeight: "bold" }}>Events</span>,
        },
        
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    switch (e.key) {
      case "1":
        navigate("/dashboardVendor", { state: { accessToken, vendorId } });
        break;
      case "2":
        navigate("/productsList", { state: { accessToken, vendorId } });
        break;
      case "3":
        navigate("/productSample", { state: { accessToken, vendorId } });
        break;
      case "4":
        navigate("/eventsVendor", { state: { accessToken, vendorId } });
        break;
      case "5":
        navigate("/Transaction", { state: { accessToken, vendorId } });
        break;
      default:
        navigate("/dashboardVendor", { state: { accessToken, vendorId } });
    }
  };

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#F7FAFC",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
        }}
        width={250} // Adjusted the width for more space
        collapsedWidth={80} // Adjusted collapsed width
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: collapsed ? "40px" : "120px",
            transition: "width 0.3s ease",
            margin: "16px auto",
            display: "block",
          }}
        />
        <Menu
          style={{
            backgroundColor: "#F7FAFC",
            color: "#4A5568",
            fontSize: "16px", // Increased font size
          }}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          items={defaultItems}
        />
      </Sider>
      <div
        style={{
          marginLeft: collapsed ? "80px" : "250px", // Adjusted margin based on the width of the Sider
          transition: "margin-left 0.3s ease",
          padding: "12px",
        }}
      >
        {/* Content will be displayed here */}
      </div>
    </>
  );
};

export default VendorSideBar;
