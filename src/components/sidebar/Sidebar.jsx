import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import logo from "../../assets/images/esms 1.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, Navigate } from "react-router-dom";
import Event from "../../pages/Event/Event";
const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "1":
        return <Event />;
      case "2":
        return <div>Manage Menu Content</div>;
      case "3":
        return <div>Revenue Statistics Content</div>;
      case "4":
        return <div>Events Content</div>;
      case "5":
        return <div>Settings Content</div>;
      case "6":
        return <div>Pricing Content</div>;
      case "7":
        return <div>Account Content</div>;
      default:
        return <div>Default Content</div>;
    }
  };

  const items = [
    {
      type: "group",
      label: <h3>Menu</h3>,
      children: [
        {
          key: "1",
          icon: <DashboardIcon />,
          label: "Dashboard",
        },
        {
          key: "2",
          icon: <MenuIcon />,
          label: "Manage Menu",
        },
        {
          key: "3",
          icon: <StackedLineChartIcon />,
          label: "Revenue statistics",
        },
        {
          key: "4",
          icon: <EventIcon />,
          label: "Events",
        },
      ],
    },
    {
      type: "group",
      label: <h3>Other</h3>,
      children: [
        {
          key: "5",
          icon: <SettingsIcon />,
          label: "Settings",
        },
        {
          key: "6",
          icon: <MonetizationOnIcon />,
          label: "Pricing",
        },
        {
          key: "7",
          icon: <AccountCircleIcon />,
          label: "Account",
        },
      ],
    },
  ];

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#A6ABC8",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 1000,
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
          style={{ backgroundColor: "#A6ABC8" }}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              className="button-sidebar"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 44,
                backgroundColor: "#F1F2F7",
                color: "#000",
                marginLeft: "20px",
              }}
            />
            <h2 style={{ margin: 0, marginLeft: 16, color: "#000" }}>Event</h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "40px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", marginRight: 24 }}
            >
              <img
                src={logo}
                alt="profile-icon"
                style={{
                  width: 50,
                  height: 36,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              <span style={{ marginRight: 8 }}>Host</span>
              <ArrowDropDownIcon />
            </div>
            <NotificationsIcon style={{ fontSize: "20px", color: "#000" }} />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 583,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
