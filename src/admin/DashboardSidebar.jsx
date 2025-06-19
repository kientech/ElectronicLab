import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { GiCircuitry } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import {
  AiOutlineLogout,
  AiOutlineFileAdd,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineComment,
  AiOutlineTags,
  AiOutlineBarChart,
} from "react-icons/ai";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { PiPhoneCallLight } from "react-icons/pi";
import { IoAdd } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../database/db";
import { Layout, Menu, Button, theme, Avatar } from "antd";

const { Sider } = Layout;

function DashboardSidebar() {
  const displayName = localStorage.getItem("displayName");
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("displayName");
      toast.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất!");
    }
  };

  const navigations = [
    {
      key: "1",
      label: "Bảng điều khiển",
      icon: <RiDashboardLine size={24} />,
      path: "/dashboard",
    },
    {
      key: "2",
      label: "Quản lý dự án",
      icon: <GiCircuitry size={24} />,
      children: [
        {
          key: "2-1",
          label: "Tạo dự án mới",
          path: "/dashboard/create-project",
          icon: <AiOutlineFileAdd size={20} />,
        },
        {
          key: "2-2",
          label: "Danh sách dự án",
          path: "/dashboard/all-projects",
          icon: <AiOutlineFileText size={20} />,
        },
        {
          key: "2-3",
          label: "Danh mục dự án",
          path: "/dashboard/categories",
          icon: <AiOutlineTags size={20} />,
        },
      ],
    },
    {
      key: "3",
      label: "Quản lý người dùng",
      icon: <AiOutlineUser size={24} />,
      children: [
        {
          key: "3-1",
          label: "Danh sách người dùng",
          path: "/dashboard/users",
          icon: <HiOutlineUser size={20} />,
        },
        {
          key: "3-2",
          label: "Phân quyền",
          path: "/dashboard/roles",
          icon: <AiOutlineSetting size={20} />,
        },
      ],
    },
    {
      key: "4",
      label: "Thống kê",
      icon: <AiOutlineBarChart size={24} />,
      children: [
        {
          key: "4-1",
          label: "Lượt xem",
          path: "/dashboard/analytics/views",
          icon: <AiOutlineBarChart size={20} />,
        },
        {
          key: "4-2",
          label: "Tương tác",
          path: "/dashboard/analytics/interactions",
          icon: <AiOutlineComment size={20} />,
        },
      ],
    },
    {
      key: "5",
      label: "Cài đặt",
      icon: <AiOutlineSetting size={24} />,
      path: "/dashboard/settings",
    },
  ];

  const getSelectedKeys = () => {
    const allPaths = navigations.flatMap((nav) =>
      nav.path ? [nav] : nav.children || []
    );
    const currentItem = allPaths.find(
      (item) => item.path === location.pathname
    );
    return currentItem ? [currentItem.key] : [];
  };

  const getDefaultOpenKeys = () => {
    const openKeys = [];
    navigations.forEach((nav) => {
      if (
        nav.children &&
        nav.children.some((child) => child.path === location.pathname)
      ) {
        openKeys.push(nav.key);
      }
    });
    return openKeys;
  };

  const {
    token: { colorBgContainer, borderRadiusLG, colorTextBase, colorPrimary },
  } = theme.useToken();

  return (
    <Sider
      width={250}
      className="h-full flex flex-col p-4"
      style={{
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
        height: "100%",
      }}
    >
      <div className="flex items-center justify-center h-16 mb-4 mt-2">
        <h1
          className="font-extrabold text-3xl transition-all duration-300"
          style={{ color: colorPrimary }}
        >
          Electronic Panel
        </h1>
      </div>
      <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700 my-4"></div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getDefaultOpenKeys()}
        className="flex-grow border-r-0"
        style={{ backgroundColor: colorBgContainer, color: colorTextBase }}
        items={navigations.map((nav) => {
          if (nav.children) {
            return {
              key: nav.key,
              icon: nav.icon,
              label: nav.label,
              children: nav.children.map((child) => ({
                key: child.key,
                icon: child.icon,
                label: (
                  <Link
                    to={child.path}
                    className="!flex !items-center !gap-x-2"
                  >
                    {child.label}
                  </Link>
                ),
              })),
            };
          } else {
            return {
              key: nav.key,
              icon: nav.icon,
              label: (
                <Link to={nav.path} className="!flex !items-center !gap-x-2">
                  {nav.label}
                </Link>
              ),
            };
          }
        })}
      />
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <Avatar
              size="small"
              className="bg-blue-500 flex items-center justify-center text-white"
            >
              {displayName?.charAt(0) || "A"}
            </Avatar>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {displayName || "Admin"}
            </span>
          </div>
          <Button
            type="text"
            icon={<AiOutlineLogout size={20} />}
            onClick={handleLogout}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 !p-0"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </Sider>
  );
}

export default DashboardSidebar;
