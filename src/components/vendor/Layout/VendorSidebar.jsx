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
import logo from "../../../assets/images/logo_EIPS.png";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const { Sider } = Layout;

const VendorSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Cập nhật selectedMenuItem dựa trên URL hiện tại
  useEffect(() => {
    if (location.pathname.startsWith("/dashboardVendor")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/listProducts")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/ManageProductItems")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/eventsVendor")) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith("/accounts")) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith("/eventpage")) {
      setSelectedMenuItem("4"); // Đảm bảo rằng mặc định chọn Event Info
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
        { key: "2", icon: <FormatListBulletedIcon />, label: "List Products" },
        { key: "3", icon: <FastfoodIcon />, label: "Manage Product Items" },
        { key: "4", icon: <EventIcon />, label: "Events" },
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    switch (e.key) {
      case "1":
        navigate("/dashboardVendor");
        break;
      case "2":
        navigate("/listProducts");
        break;
      case "3":
        navigate("/ManageProductItems");
        break;
      case "4":
        navigate("/eventsVendor");
        break;
      case "5":
        navigate("/accounts");
        break;
      default:
        navigate("/dashboardVendor");
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
          location.pathname.startsWith("/eventpage")
            ? defaultItems
            : defaultItems
        }
      />
    </Sider>
  );
};

export default VendorSideBar;
