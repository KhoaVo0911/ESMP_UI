import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import StorefrontIcon from "@mui/icons-material/Storefront";
import logo from "../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const HostSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/events")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/manage-product")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/accounts")) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith("/settings")) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith("/package")) {
      setSelectedMenuItem("6");
    } else if (location.pathname.startsWith("/event-detail")) {
      setSelectedMenuItem("7");
    }
  }, [location.pathname]);

  const eventDetailItems = [
    {
      type: "group",
      children: [
        {
          key: "7",
          icon: <InfoIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Event Info
            </span>
          ),
          onClick: () => navigate(`/event-detail/${eventId}`),
        },
        {
          key: "8",
          icon: <LocalGroceryStoreIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Transaction
            </span>
          ),
          onClick: () => navigate(`/event/transactions`),
          // onClick: () => navigate(`/event/transactions/${eventId}`),
        },
        {
          key: "9",
          icon: <StorefrontIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Booth Plan
            </span>
          ),
          onClick: () => navigate(`/event/booth-plan`),
          // onClick: () => navigate(`/event/transactions/${eventId}`),
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
          onClick: () => navigate("/dashboard"),
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
          onClick: () => navigate("/events"),
        },
        {
          key: "3",
          icon: <LocalGroceryStoreIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Manage Product
            </span>
          ),
          onClick: () => navigate("/manage-product"),
        },
        {
          key: "4",
          icon: <AccountCircleIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Accounts
            </span>
          ),
          onClick: () => navigate("/accounts"),
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
          key: "5",
          icon: <SettingsIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Settings
            </span>
          ),
          onClick: () => navigate("/settings"),
        },
        {
          key: "6",
          icon: <MonetizationOnIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Package
            </span>
          ),
          onClick: () => navigate("/package"),
        },
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
  };

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
            location.pathname.startsWith("/event/transactions") ||
            location.pathname.startsWith("/event/booth-plan")
              ? eventDetailItems
              : defaultItems
          }
        />
      </Sider>

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

export default HostSideBar;
