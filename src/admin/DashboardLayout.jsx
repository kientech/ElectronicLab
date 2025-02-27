import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  <div className="">
    <div className="flex bg-[#F5F7FE] min-h-screen p-2 rounded-xl">
      <DashboardSidebar />
      <div className="w-[80%]">
        <Header />
        <div className="px-4 mx-8">
          <Outlet />
        </div>
      </div>
    </div>
  </div>;
}

export default DashboardLayout;
