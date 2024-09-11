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
      setSelectedMenuItem("1"); // Đảm bảo rằng mặc định chọn Event Info
    }
  }, [location.pathname]);

  // Sidebar items cho event detail
  const eventDetailItems = [
    {
      type: "group",
      children: [
        {
          key: "1",
          icon: <InfoIcon />,
          label: "Event info",
        },
        {
          key: "2",
          icon: <LocalGroceryStoreIcon />,
          label: "Transaction",
        },
      ],
    },
  ];

  // Sidebar items mặc định
  const defaultItems = [
    {
      type: "group",
      label: <h3>Menu</h3>,
      children: [
        { key: "1", icon: <DashboardIcon />, label: "Dashboard" },
        { key: "2", icon: <EventIcon />, label: "Events" },
      ],
    },
    {
      type: "group",
      label: <h3>Others</h3>,
      children: [
        { key: "3", icon: <SettingsIcon />, label: "Settings" },
        { key: "4", icon: <MonetizationOnIcon />, label: "Pricing" },
        { key: "5", icon: <AccountCircleIcon />, label: "Account" },
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
      default:
        navigate("/dashboard");
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        backgroundColor: "#fff" /* Nền màu trắng */,
        height: "135vh",
        position: "sticky",
        top: 0,
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)" /* Đổ bóng nhẹ */,
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
        style={{ backgroundColor: "#fff", color: "#3A4374" }}
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuClick}
        items={
          location.pathname.startsWith("/event-detail")
            ? eventDetailItems
            : defaultItems
        }
      />
    </Sider>
  );
};

export default HostSideBar;
