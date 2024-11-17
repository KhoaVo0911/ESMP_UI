import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ExtensionIcon from "@mui/icons-material/Extension";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import logo from "../../assets/images/logo_EIPS.png";

const { Sider } = Layout;

const HostSideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = useParams().eventId || sessionStorage.getItem("eventId");
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const hostId =
    location.state?.hostId || sessionStorage.getItem("hostId") || "";

  useEffect(() => {
    console.log("Current eventId:", eventId);
    if (location.pathname.startsWith("/dashboard")) {
      setSelectedMenuItem("1");
    } else if (location.pathname.startsWith("/events")) {
      setSelectedMenuItem("2");
    } else if (location.pathname.startsWith("/accounts")) {
      setSelectedMenuItem("4");
    } else if (location.pathname.startsWith("/settings")) {
      setSelectedMenuItem("5");
    } else if (location.pathname.startsWith("/packages")) {
      setSelectedMenuItem("6");
    } else if (location.pathname.startsWith("/event-detail")) {
      setSelectedMenuItem("10");
    } else if (location.pathname.startsWith("/eventconfig")) {
      setSelectedMenuItem("eventconfig");
    } else if (
      location.pathname.startsWith(`/event/${eventId}/extensionEvent`)
    ) {
      setSelectedMenuItem("9");
    } else if (
      location.pathname.startsWith(`/event/${eventId}/location-type`)
    ) {
      setSelectedMenuItem("11");
    }
  }, [location.pathname]);

  const eventDetailItems = [
    {
      type: "group",
      children: [
        {
          key: "10",
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
          key: "7",
          icon: <LocalGroceryStoreIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Transaction
            </span>
          ),
          onClick: () => navigate(`/event/${eventId}/transactions`),
        },
        {
          key: "8",
          icon: <StorefrontIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Booth Plan
            </span>
          ),
          onClick: () => navigate(`/event/${eventId}/booth-plan`),
        },
        // {
        //   key: "11",
        //   icon: <StorefrontIcon />,
        //   label: (
        //     <span
        //       style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
        //     >
        //       Location Type
        //     </span>
        //   ),
        //   onClick: () => navigate(`/event/${eventId}/location-type`),
        // },
        {
          key: "9",
          icon: <ExtensionIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Extension Event
            </span>
          ),
          onClick: () => navigate(`/event/${eventId}/extensionEvent`),
        },
      ],
    },
  ];

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
        {
          key: "categories",
          icon: <CategoryIcon />,
          label: (
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#1B2559" }}
            >
              Event Config
            </span>
          ),
          onClick: () => navigate("/eventconfig"),
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
          onClick: () => navigate("/packages"),
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
                navigate("/dashboard");
                break;
              case "2":
                navigate(`/events/host/${hostId}`);
                break;
              case "4":
                navigate("/accounts");
                break;
              case "5":
                navigate("/settings");
                break;
              case "6":
                navigate("/packages");
                break;
              case "7":
                navigate(`/event/transactions`);
                break;
              case "8":
                navigate(`/event/${eventId}/booth-plan`);
                break;
              case "9":
                navigate(`/event/${eventId}/extensionEvent`);
                break;
              case "10":
                navigate(`/event-detail/${eventId}`);
                break;
              case "11":
                navigate(`/event/${eventId}/location-type`);
                break;
              case "categories":
                navigate(`/eventconfig`);
                break;
              default:
                navigate("/dashboard");
            }
          }}
          items={
            location.pathname.startsWith("/event-detail") ||
            location.pathname.startsWith("/event/transactions") ||
            location.pathname.startsWith(`/event/${eventId}/booth-plan`) ||
            location.pathname.startsWith(`/event/${eventId}/location-type`) ||
            location.pathname.startsWith(`/event/${eventId}/extensionEvent`)
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
