import React, { useState } from "react";
import { Layout } from "antd";
import HostSideBar from "./HostSideBar";
import HostHeader from "./HostHeader";

const { Content } = Layout;

const HostLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <HostSideBar collapsed={collapsed} />

      <Layout>
        {/* Header */}
        <HostHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

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

export default HostLayout;
