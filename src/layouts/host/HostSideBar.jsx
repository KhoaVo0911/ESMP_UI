import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import logo from "../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const HostSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Cập nhật selectedMenuItem dựa trên URL hiện tại
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/events")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/settings")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/pricing")) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith("/accounts")) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith("/event-detail")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/event/transactions")) {
      setSelectedMenuItem("6");
    }
  }, [location.pathname]);

  // Sidebar items cho event detail (Menu con)
  const eventDetailItems = [
    {
      type: "group",
      children: [
        {
          key: "1",
          icon: <InfoIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Event info
            </span>
          ),
          onClick: () => navigate("/event-detail"),
        },
        {
          key: "6",
          icon: <LocalGroceryStoreIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Transaction
            </span>
          ),
          onClick: () => navigate("/event/transactions"),
        },
      ],
    },
  ];

  // Sidebar items mặc định (Menu cha)
  const defaultItems = [
    {
      type: "group",
      label: (
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}>
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
        },
        {
          key: "2",
          icon: <EventIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Events
            </span>
          ),
        },
      ],
    },
    {
      type: "group",
      label: (
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}>
          Others
        </h3>
      ),
      children: [
        {
          key: "3",
          icon: <SettingsIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Settings
            </span>
          ),
        },
        {
          key: "4",
          icon: <MonetizationOnIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Pricing
            </span>
          ),
        },
        {
          key: "5",
          icon: <AccountCircleIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Account
            </span>
          ),
        },
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    switch (e.key) {
      case "1":
        navigate("/dashboard");
        break;
      case "2":
        navigate("/events");
        break;
      case "3":
        navigate("/settings");
        break;
      case "4":
        navigate("/pricing");
        break;
      case "5":
        navigate("/accounts");
        break;
      case "6":
        navigate("/event/transactions");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#fff",
          height: "100vh", // Đặt chiều cao của sidebar là 100% chiều cao viewport
          position: "fixed", // Sử dụng position fixed để cố định sidebar
          left: 0, // Đặt ở bên trái
          top: 0, // Bắt đầu từ đầu trang
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: collapsed ? "80px" : "200px",
            transition: "width 0.3s ease",
            margin: "16px auto",
            display: "block",
          }}
        />
        <Menu
          style={{ backgroundColor: "#fff", color: "#1B2559" }}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          items={
            location.pathname.startsWith("/event-detail") ||
            location.pathname.startsWith("/event/transactions")
              ? eventDetailItems // Sử dụng menu con khi ở event-detail hoặc transactions
              : defaultItems
          }
        />
      </Sider>

      {/* Nội dung chính cần đặt margin-left để tránh bị đè */}
      <div
        style={{
          marginLeft: collapsed ? "80px" : "200px",
          transition: "margin-left 0.3s ease",
          padding: "12px", // Khoảng cách padding cho nội dung chính
        }}
      >
        {/* Nội dung chính của bạn sẽ nằm ở đây */}
      </div>
    </>
  );
};

export default HostSideBar;
