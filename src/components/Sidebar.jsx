import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { GiCircuitry } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { PiPhoneCallLight } from "react-icons/pi";
import { toSlug } from "../utils/toSlug";

import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../database/db"; // Import auth from your Firebase config

function Sidebar() {
  const displayName = localStorage.getItem("displayName");
  console.log(auth);

  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  const navigations = [
    {
      id: 1,
      name: "Trang Chủ",
      icon: <RiDashboardLine size={24} />,
      path: "/",
    },
    {
      id: 2,
      name: "Giới Thiệu",
      icon: <HiOutlineUser size={24} />,
      path: "/about-me",
    },
    {
      id: 3,
      name: "Phát Triển Mới Nhất",
      icon: <GiCircuitry size={24} />,
      path: "/phat-trien-moi-nhat",
    },
    {
      id: 4,
      name: "Dự Án Nổi Bật",
      icon: <FaLaptopCode size={24} />,
      path: `/du-an-noi-bat`,
    },
    {
      id: 6,
      name: "Bài Viết",
      icon: <LiaProjectDiagramSolid size={24} />,
      path: "/challenge-series",
    },
    {
      id: 7,
      name: "Liên Hệ",
      icon: <PiPhoneCallLight size={24} />,
      path: "/contact",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("displayName");
      toast.success("Log Out Successfully", {
        position: "top-center", // Positioning the toast at the top center
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false, // Show the progress bar
        closeOnClick: true, // Close on click
        pauseOnHover: true, // Pause on hover
        draggable: true, // Allow dragging the toast
      });
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Log Out Failed", {
        position: "top-center", // Positioning the toast at the top center
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false, // Show the progress bar
        closeOnClick: true, // Close on click
        pauseOnHover: true, // Pause on hover
        draggable: true, // Allow dragging the toast
      });
    }
  };

  return (
    <div
      className="w-[20%] h-full bg-white rounded-xl py-4 px-4 md:flex md:flex-col sticky top-2 left-2 bottom-2 hidden"
      style={{ minHeight: `calc(100vh - 4px)` }}
    >
      <div className="mt-2">
        <Link to={"/"}>
          <h1 className="font-bold text-2xl text-black text-center">
            ElectronicLab
          </h1>
        </Link>
        <div className="w-full h-[1px] bg-gray-100 my-6"></div>
      </div>
      <nav className="flex-grow mt-4">
        <ul>
          {navigations.map((item) => (
            <li key={item.id} className="my-4 list-none">
              <Link
                to={item.path}
                className={`flex items-center py-4 px-4 space-x-3 rounded-lg text-gray-600 
                ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                    : ""
                }
                hover:bg-gray-100`}
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
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {displayName ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 mt-auto px-4 py-4 rounded-lg bg-red-100"
        >
          <AiOutlineLogout className="text-xl" />
          <span>Log out</span>
        </button>
      ) : (
        <Link
          to={"/login"}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mt-auto px-4 py-4 rounded-lg bg-green-100"
        >
          <AiOutlineLogout className="text-xl" />
          <span>Khám Phá</span>
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
