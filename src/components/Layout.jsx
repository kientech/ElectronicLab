import React from "react";
import { Layout, Button, Space } from "antd";
import { useTheme } from "../context/ThemeContext";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="max-w-7xl mx-auto">
          <Space className="mb-4">
            <Button
              type="text"
              icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggleTheme}
              className="text-lg"
            />
          </Space>
          <Outlet />
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default AppLayout;
