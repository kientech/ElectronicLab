import React, { useEffect, useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "../contexts/AuthContext";
import { Button, Dropdown, message, Space, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "remixicon/fonts/remixicon.css";

function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Xác định greeting ngay khi component render
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const [greeting, setGreeting] = useState(getGreeting());

  const handleLogout = async () => {
    try {
      await logout();
      message.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      message.error("Đăng xuất thất bại!");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  // Thêm menu admin nếu user có role admin
  if (isAdmin()) {
    userMenuItems.splice(2, 0, {
      key: "admin",
      label: <Link to="/dashboard">Quản trị</Link>,
      icon: <SettingOutlined />,
    });
  }

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
      setCurrentTime(now.toLocaleTimeString([], timeOptions));
      const dateOptions = { month: "long", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("vi-VN", dateOptions));
      const newGreeting = getGreeting();
      if (newGreeting !== greeting) {
        setGreeting(newGreeting);
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [greeting]);

  return (
    <div className="flex items-center justify-between md:p-4 md:mx-8 md:ml-0 ml-16 dark:text-white p-4">
      <div>
        <h1 className="font-bold text-blue-500 dark:text-white md:text-xl text-sm">
          {greeting}, {user ? user.displayName : "Quý khách"} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user
            ? "Chúc bạn một ngày tốt lành!"
            : "Vui lòng đăng nhập để trải nghiệm đầy đủ tính năng"}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-x-4">
        <div>
          <p className="font-semibold md:text-xl text-md text-blue-500 dark:text-white">
            {currentTime}
          </p>
          <p className="font-base md:text-md text-sm text-gray-400 dark:text-gray-300">
            {currentDate}
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 h-10 w-10 flex items-center justify-center"
        >
          <i
            className={`w-6 h-6 block ${
              isDarkMode ? "ri-sun-line" : "ri-moon-line"
            }`}
          ></i>
        </button>

        {/* Auth Buttons */}
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button type="primary" icon={<UserOutlined />} className="h-10">
              {user.displayName}
            </Button>
          </Dropdown>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => setShowAuthModal(true)}
              className="h-10"
            >
              Đăng nhập
            </Button>
            {/* <Button
              icon={<UserAddOutlined />}
              onClick={() => setShowAuthModal(true)}
              className="h-10"
            >
              Đăng ký
            </Button> */}
          </Space>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default Header;
