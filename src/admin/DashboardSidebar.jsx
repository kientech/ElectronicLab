import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { GiCircuitry } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import {
  AiOutlineLogout,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
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

function DashboardSidebar() {
  const displayName = localStorage.getItem("displayName");
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubNav, setOpenSubNav] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSubNav = (id) => {
    setOpenSubNav((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      id: 1,
      name: "Bảng điều khiển",
      icon: <RiDashboardLine size={24} />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Quản lý dự án",
      icon: <GiCircuitry size={24} />,
      subNav: [
        {
          id: "2-1",
          name: "Tạo dự án mới",
          path: "/dashboard/create-project",
          icon: <AiOutlineFileAdd size={20} />,
        },
        {
          id: "2-2",
          name: "Danh sách dự án",
          path: "/dashboard/all-projects",
          icon: <AiOutlineFileText size={20} />,
        },
        {
          id: "2-3",
          name: "Danh mục dự án",
          path: "/dashboard/categories",
          icon: <AiOutlineTags size={20} />,
        },
      ],
    },
    {
      id: 3,
      name: "Quản lý người dùng",
      icon: <AiOutlineUser size={24} />,
      subNav: [
        {
          id: "3-1",
          name: "Danh sách người dùng",
          path: "/dashboard/users",
          icon: <HiOutlineUser size={20} />,
        },
        {
          id: "3-2",
          name: "Phân quyền",
          path: "/dashboard/roles",
          icon: <AiOutlineSetting size={20} />,
        },
      ],
    },
    {
      id: 4,
      name: "Thống kê",
      icon: <AiOutlineBarChart size={24} />,
      subNav: [
        {
          id: "4-1",
          name: "Lượt xem",
          path: "/dashboard/analytics/views",
          icon: <AiOutlineBarChart size={20} />,
        },
        {
          id: "4-2",
          name: "Tương tác",
          path: "/dashboard/analytics/interactions",
          icon: <AiOutlineComment size={20} />,
        },
      ],
    },
    {
      id: 5,
      name: "Cài đặt",
      icon: <AiOutlineSetting size={24} />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <div
      className={`h-full bg-white dark:bg-gray-800 rounded-xl py-4 px-4 flex flex-col top-2 left-2 bottom-2 transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-16" : "w-[20%]"
      }`}
      style={{ minHeight: `calc(100vh - 4px)` }}
    >
      <button
        onClick={toggleSidebar}
        className="text-gray-600 dark:text-gray-300 absolute top-2 -right-4 bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 self-end"
      >
        {isCollapsed ? (
          <AiOutlineMenuUnfold size={24} />
        ) : (
          <AiOutlineMenuFold size={24} />
        )}
      </button>
      <div className="mt-2">
        {!isCollapsed && (
          <h1 className="font-bold text-2xl text-black dark:text-white text-center">
            Electronic Panel
          </h1>
        )}
        <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700 my-6"></div>
      </div>
      <nav className="flex-grow mt-4">
        <ul className="list-none">
          {navigations.map((item) => (
            <li key={item.id} className="my-4">
              <div className="flex items-center justify-between">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center py-4 px-4 space-x-3 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } w-full`}
                  >
                    <span
                      className={`${
                        location.pathname === item.path
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="w-full">{item.name}</span>
                    )}
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between py-4 px-4 space-x-3 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out ${
                      openSubNav[item.id]
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } w-full cursor-pointer`}
                    onClick={() => toggleSubNav(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span>{item.icon}</span>
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span>
                        {openSubNav[item.id] ? (
                          <AiOutlineUp />
                        ) : (
                          <AiOutlineDown />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {item.subNav && openSubNav[item.id] && !isCollapsed && (
                <ul className="ml-6 mt-2 space-y-2 transition-all duration-300 ease-in-out">
                  {item.subNav.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        to={subItem.path}
                        className={`flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out ${
                          location.pathname === subItem.path
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        } w-full`}
                      >
                        <span>{subItem.icon}</span>
                        <span>{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {displayName?.charAt(0) || "A"}
            </div>
            {!isCollapsed && (
              <span className="text-gray-600 dark:text-gray-300">
                {displayName || "Admin"}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
          >
            <AiOutlineLogout size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
