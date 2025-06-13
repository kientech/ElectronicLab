import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

const ProtectRoute = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    message.error("Vui lòng đăng nhập để truy cập!");
    return <Navigate to="/" />;
  }

  if (!isAdmin()) {
    message.error("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectRoute;
