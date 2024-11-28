import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import logo from "../../../assets/images/logo_EIPS.png";
import BackpackIcon from '@mui/icons-material/Backpack';
import AdminAccountManagement from "../AccountManagement";
import TransactionDetails from "../TransHistory";
import PackageAdmin from "../PackageAdmin";

const { Sider } = Layout;

const AdminSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  useEffect(() => {
    const pathToKeyMap = {
      "/admin": "1",
      "/adtransaction": "2",
      "/admin-package": "3", // Ensure this path exactly matches the route
    };

    const selectedKey = Object.keys(pathToKeyMap).find((path) =>
      location.pathname.startsWith(path)
    );
    const currentSelectedMenu = pathToKeyMap[selectedKey] || "1";
    if (selectedMenuItem !== currentSelectedMenu) {
      setSelectedMenuItem(currentSelectedMenu);
    }
  }, [location.pathname, selectedMenuItem]);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardIcon />,
      label: "Host Accounts List",
    },
    {
      key: "2",
      icon: <FormatListBulletedIcon />,
      label: "Transaction History",
    },
    {
      key: "3",
      icon: <BackpackIcon />,
      label: "Package Management",
    },
  ];

  const handleMenuClick = (e) => {
    const keyToPathMap = {
      "1": "/admin",
      "2": "/adtransaction",
      "3": "/admin-package",  // Ensure this is exactly the route
    };

    setSelectedMenuItem(e.key);
    navigate(keyToPathMap[e.key]);
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
    fontWeight: "bold"
        }}
        width={250}
        collapsedWidth={80}
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
            fontSize: "16px",
            fontFamily:"bold"
          }}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <div
        style={{
          marginLeft: collapsed ? "80px" : "250px",
          transition: "margin-left 0.3s ease",
          padding: "12px",
        }}
      >
        {/* Content rendering will occur here */}
      </div>
    </>
  );
};

export default AdminSideBar;