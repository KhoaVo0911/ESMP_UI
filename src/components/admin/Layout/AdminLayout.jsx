import React, { useState } from "react";
import { Layout } from "antd";
import AdminSideBar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <AdminSideBar collapsed={collapsed} />

      <Layout>
        {/* Header */}
        <AdminHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

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

export default AdminLayout;
