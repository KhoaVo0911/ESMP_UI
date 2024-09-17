import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import logo from "../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const HostSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/events")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/settings")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/packages")) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith("/accounts")) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith("/manage-product")) {
      setSelectedMenuItem("6");
    } else if (location.pathname.startsWith("/event/transactions")) {
      setSelectedMenuItem("7");
    }
  }, [location.pathname]);

  const defaultItems = [
    {
      type: "group",
      label: (
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#A0AEC0" }}>
          MENU
        </h3>
      ),
      children: [
        {
          key: "1",
          icon: <DashboardIcon />,
          label: (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "1" ? "#0d6efd" : "#4A5568",
              }}
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
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "2" ? "#0d6efd" : "#4A5568",
              }}
            >
              Events
            </span>
          ),
        },
        {
          key: "6",
          icon: <LocalGroceryStoreIcon />,
          label: (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "6" ? "#0d6efd" : "#4A5568",
              }}
            >
              Manage Product
            </span>
          ),
        },
        {
          key: "5",
          icon: <AccountCircleIcon />,
          label: (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "5" ? "#0d6efd" : "#4A5568",
              }}
            >
              Accounts
            </span>
          ),
        },
      ],
    },
    {
      type: "group",
      label: (
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#A0AEC0" }}>
          OTHERS
        </h3>
      ),
      children: [
        {
          key: "3",
          icon: <SettingsIcon />,
          label: (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "3" ? "#0d6efd" : "#4A5568",
              }}
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
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: selectedMenuItem === "4" ? "#0d6efd" : "#4A5568",
              }}
            >
              Package
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
        navigate("/packages");
        break;
      case "5":
        navigate("/accounts");
        break;
      case "6":
        navigate("/manage-product");
        break;
      case "7":
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
          backgroundColor: "#F7FAFC",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
        }}
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
          style={{ backgroundColor: "#F7FAFC", color: "#4A5568" }}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          items={defaultItems}
        />
      </Sider>
      <div
        style={{
          marginLeft: collapsed ? "80px" : "200px",
          transition: "margin-left 0.3s ease",
          padding: "12px",
        }}
      >
        {/* Content will be displayed here */}
      </div>
    </>
  );
};

export default HostSideBar;
