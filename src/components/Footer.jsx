import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="m-2 md:px-16 md:py-12 p-2 rounded-lg bg-white dark:bg-[#1C1C1C]">
      <div className="m-2 flex justify-between items-center">
        <div className="w-[60%]">
          <h1 className="font-bold text-gray-800 my-4 text-3xl dark:text-white">
            Electronic Lab
          </h1>
          <div className="md:flex items-center gap-x-4">
            <Link
              to={"/"}
              className="font-base text-md text-gray-500 dark:text-white block"
            >
              Trang chủ
            </Link>
            <Link
              to={"/"}
              className="font-base text-md text-gray-500 dark:text-white block"
            >
              Giới thiệu
            </Link>
            <Link
              to={"/"}
              className="font-base text-md text-gray-500 dark:text-white block"
            >
              Phát Triển Mới Nhất
            </Link>
            <Link
              to={"/"}
              className="font-base text-md text-gray-500 dark:text-white block"
            >
              Dự Án Nổi Bật
            </Link>
            <Link
              to={"/"}
              className="font-base text-md text-gray-500 dark:text-white block"
            >
              Liên Hệ
            </Link>
          </div>
        </div>
        <div className="w-[40%]">
          <h2 className="font-semibold text-gray-700 dark:text-white mb-2 text-[11px] md:text-lg">
            Nhận thông báo mới
          </h2>
          <div className="w-full md:flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập email của bạn"
              className="py-2 px-2 border border-gray-100 w-full rounded-lg"
            />
            <button className="bg-blue-200 py-2 px-8 rounded-lg md:mt-0 mt-2 w-full">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto h-[1px] bg-gray-300 my-12"></div>
      <div>
        <p className="text-center dark:text-white">
          &copy;{" "}
          <span className="font-semibold text-gray-700 dark:text-white">
            2025 Electronic Lab
          </span>
          . Tất Cả Các Quyền Đều Được Bảo Lưu.
        </p>
      </div>
    </div>
  );
}

export default Footer;
