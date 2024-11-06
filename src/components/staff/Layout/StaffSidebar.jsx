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

const StaffSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Update selectedMenuItem based on current URL
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
      label: <h3 style={{ fontWeight: "bold", color: "#A0AEC0" }}>MENU</h3>, // Adjusting group title style
      children: [
        {
          key: "1",
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
        navigate("/eventStaff");
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

export default StaffSideBar;
