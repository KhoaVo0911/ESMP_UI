import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BackpackIcon from "@mui/icons-material/Backpack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const HostSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = useParams().eventId || sessionStorage.getItem("eventId");
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  // Update selected menu item based on the location
  useEffect(() => {
    if (location.pathname.startsWith(`/dashboard-admin`)) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/adtransaction")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/admin-package")) {
      setSelectedMenuItem("3");
    } else if (location.pathname.startsWith("/accountList")) {
      setSelectedMenuItem("4");
    }
  }, [location.pathname]);

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
          onClick: () => navigate(`/dashboard-admin`),
        },
        {
          key: "2",
          icon: <AccountCircleIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Host Management
            </span>
          ),
          onClick: () => navigate("/accountList"),
        },
        {
          key: "3",
          icon: <BackpackIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Package Management
            </span>
          ),
          onClick: () => navigate("/admin-package"),
        },
       
        {
          key: "4",
          icon: <FormatListBulletedIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Transaction History
            </span>
          ),
          onClick: () => navigate(`/adtransaction`),
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
          onClick={(e) => {
            setSelectedMenuItem(e.key);
            switch (e.key) {
              case "1":
                navigate(`/dashboard-admin`);
                break;
              case "2":
                navigate("/accountList");
                break;
              case "3":
                navigate("/admin-package");
                break;
              case "4":
                navigate(`/adtransaction`);
                break;
              default:
                navigate(`/dashboard-admin`);
            }
          }}
          items={defaultItems}
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
