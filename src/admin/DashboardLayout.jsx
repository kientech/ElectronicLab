import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Header: AntHeader, Content } = Layout;

function DashboardLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardSidebar />
      <Layout>
        <AntHeader style={{ padding: 0, background: "#F5F7FE" }}>
          <Header />
        </AntHeader>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "10px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
