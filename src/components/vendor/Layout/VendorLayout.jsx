import React, { useState } from "react";
import { Layout } from "antd";
import VendorSideBar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";

const { Content } = Layout;

const VendorLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <VendorSideBar collapsed={collapsed} />

      <Layout>
        {/* Header */}
        <VendorHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            // backgroundColor: "#fff",
            borderRadius: "8px",
            minHeight: "100vh",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default VendorLayout;
