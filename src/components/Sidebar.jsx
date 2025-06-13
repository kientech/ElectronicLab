import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Drawer, Button } from "antd";
import { RiDashboardLine, RiMenu3Line } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { GiCircuitry } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { PiPhoneCallLight } from "react-icons/pi";
import { FaInfinity } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../database/db";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const displayName = localStorage.getItem("displayName");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("displayName");
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      toast.error("Đăng xuất thất bại!");
    }
  };

  const items = [
    {
      key: "/",
      label: "Trang Chủ",
      icon: <RiDashboardLine size={20} />,
    },
    {
      key: "/about-me",
      label: "Giới Thiệu",
      icon: <HiOutlineUser size={20} />,
    },
    {
      key: "/phat-trien-moi-nhat",
      label: "Phát Triển Mới Nhất",
      icon: <GiCircuitry size={20} />,
    },
    {
      key: "/du-an-noi-bat",
      label: "Dự Án Nổi Bật",
      icon: <FaLaptopCode size={20} />,
    },
    {
      key: "/ung-dung-cong-nghe",
      label: "Ứng Dụng Công Nghệ",
      icon: <FaInfinity size={20} />,
    },
    {
      key: "/nen-tang-ky-thuat",
      label: "Nền Tảng Kỹ Thuật",
      icon: <LiaProjectDiagramSolid size={20} />,
    },
    {
      key: "/bai-viet",
      label: "Bài Viết",
      icon: <BsReverseLayoutTextSidebarReverse size={20} />,
    },
    {
      key: "/contact",
      label: "Liên Hệ",
      icon: <PiPhoneCallLight size={20} />,
    },
    {
      key: "divider",
      type: "divider",
    },
    displayName && {
      key: "logout",
      label: "Đăng Xuất",
      icon: <AiOutlineLogout size={20} />,
      onClick: handleLogout,
    },
  ].filter(Boolean);

  return (
    <>
      <div className="hidden md:block max-w-[20%] max-h-screen bg-white dark:bg-[#161617] rounded-xl py-4 px-4 sticky top-2 left-2 bottom-2">
        <Link to="/">
          <h1 className="font-bold text-2xl text-black dark:text-white text-center">
            ElectronicLab
          </h1>
        </Link>
        <div className="w-full h-[1px] bg-gray-100 my-6"></div>
        <div className="h-full">
          <Menu
            className="bg-white text-black dark:bg-[#161617] dark:text-white"
            onClick={({ key }) => {
              if (key === "logout") return;
              navigate(key);
            }}
            selectedKeys={[location.pathname]}
            mode="inline"
            style={{
              width: 256,
              border: "none",
              fontFamily: '"League Spartan", sans-serif',
            }}
            items={items.map((item) => ({
              ...item,
              className: `py-8 ${
                location.pathname === item.key
                  ? "bg-gray-100 dark:bg-[#1c1c1c] dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-[#1c1c1c] dark:hover:text-white"
              }`,
            }))}
          />
        </div>
      </div>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          type="text"
          icon={<RiMenu3Line size={28} />}
          onClick={() => setOpenDrawer(true)}
        />
      </div>
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{
          body: {
            padding: 0,
            backgroundColor: "#F5F7FE",
          },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => {
            navigate(key);
            setOpenDrawer(false);
          }}
          className="bg-transparent"
        />
      </Drawer>
    </>
  );
};

export default Sidebar;
