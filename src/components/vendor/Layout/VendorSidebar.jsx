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
    } else if (location.pathname.startsWith("/transaction")) {
      setSelectedMenuItem("5");
    }
  }, [location.pathname]);

  const defaultItems = [
    {
      type: "group",
      label: <h3>Menu</h3>,
      children: [
        { key: "1", icon: <DashboardIcon />, label: "Dashboard" },
        { key: "2", icon: <FormatListBulletedIcon />, label: "Products List" },
        { key: "3", icon: <FastfoodIcon />, label: "Manage Product Items" },
        { key: "4", icon: <EventIcon />, label: "Events" },
        { key: "5", icon: <PaidIcon />, label: "Transaction" },
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
        navigate("/productsList");
        break;
      case "3":
        navigate("/ManageProductItems");
        break;
      case "4":
        navigate("/eventsVendor");
        break;
      case "5":
        navigate("/Transaction");
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
        backgroundColor: "#fff",
        height: "135vh",
        position: "sticky",
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
        style={{
          backgroundColor: "#fff",
          color: "#3A4374",
        }}
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuClick}
        theme="light"
      >
        {defaultItems[0].children.map((menuItem) => (
          <Menu.Item
            key={menuItem.key}
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              fontSize: "16px", // Chữ to hơn
              fontWeight: "bold", // In đậm
              height: "auto", // Đảm bảo item có chiều cao tự động theo nội dung
              padding: "10px 24px", // Điều chỉnh khoảng cách padding
            }}
          >
            {menuItem.icon}
            {/* Thêm khoảng cách giữa icon và chữ */}
            <span style={{ marginLeft: "10px" }}>{menuItem.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default VendorSideBar;
