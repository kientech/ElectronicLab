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

  const navigations = [
    {
      id: 1,
      name: "Dashboard",
      icon: <RiDashboardLine size={24} />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Create Project",
      icon: <IoAdd size={24} />,
      path: "/dashboard/create-project",
    },
    {
      id: 3,
      name: "All Projects",
      icon: <GiCircuitry size={24} />,
      path: "/dashboard/all-projects",
    },
    //   subNav: [
    //     {
    //       id: "3-1",
    //       name: "Explorer Series",
    //       path: "/dashboard/projects/explorer-series",
    //     },
    //     {
    //       id: "3-2",
    //       name: "Challenge Series",
    //       path: "/dashboard/projects/challenge-series",
    //     },
    //   ],
    // },
    {
      id: 4,
      name: "Contact",
      icon: <PiPhoneCallLight size={24} />,
      path: "/dashboard/contact",
    },
  ];

  return (
    <div
      className={`h-full bg-white rounded-xl py-4 px-4 flex flex-col top-2 left-2 bottom-2 transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-16" : "w-[20%]"
      }`}
      style={{ minHeight: `calc(100vh - 4px)` }}
    >
      <button
        onClick={toggleSidebar}
        className="text-gray-600 absolute top-2 -right-4 bg-gray-100 rounded-full p-2 hover:text-gray-800 transition-colors duration-200 self-end"
      >
        {isCollapsed ? (
          <AiOutlineMenuUnfold size={24} />
        ) : (
          <AiOutlineMenuFold size={24} />
        )}
      </button>
      <div className="mt-2">
        {!isCollapsed && (
          <h1 className="font-bold text-2xl text-black text-center">
            Electronic Panel
          </h1>
        )}
        <div className="w-full h-[1px] bg-gray-100 my-6"></div>
      </div>
      <nav className="flex-grow mt-4">
        <ul>
          {navigations.map((item) => (
            <li key={item.id} className="my-4">
              <div className="flex items-center justify-between">
                <Link
                  to={item.path}
                  className={`flex items-center py-4 px-4 space-x-3 rounded-lg text-gray-600 transition-all duration-300 ease-in-out ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } w-full`}
                >
                  <span
                    className={`${
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="w-full">{item.name}</span>}
                </Link>
                {item.subNav && !isCollapsed && (
                  <button
                    onClick={() => toggleSubNav(item.id)}
                    className="ml-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    {openSubNav[item.id] ? <AiOutlineUp /> : <AiOutlineDown />}
                  </button>
                )}
              </div>
              {item.subNav && openSubNav[item.id] && !isCollapsed && (
                <ul className="ml-6 mt-2 space-y-2 transition-all duration-300 ease-in-out">
                  {item.subNav.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        to={subItem.path}
                        className={`block py-2 px-4 rounded-lg text-gray-600 transition-all duration-300 ease-in-out ${
                          location.pathname === subItem.path
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        } w-full`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default DashboardSidebar;
