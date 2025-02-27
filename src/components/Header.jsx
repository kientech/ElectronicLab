import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const displayName = localStorage.getItem("displayName");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time as "8:00PM"
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
      const formattedTime = now.toLocaleTimeString([], timeOptions);

      // Format date as "25 Tháng 2, 2025"
      const dateOptions = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = now.toLocaleDateString("vi-VN", dateOptions);

      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);

      // Set greeting based on the current hour
      const currentHour = now.getHours();
      if (currentHour < 12) {
        setGreeting("Chào buổi sáng");
      } else if (currentHour < 18) {
        setGreeting("Chào buổi chiều");
      } else {
        setGreeting("Chào buổi tối");
      }
    };

    updateDateTime(); // Set initial time and date
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between md:p-4 md:mx-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[#232F70] md:text-xl text-sm">
              {greeting}, {displayName ? displayName : "Member's Lab"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <div className="">
            <p className="font-semibold md:text-xl text-md text-blue-500">
              {currentTime}
            </p>
            <p className="font-base md:text-md text-sm text-gray-400">
              {currentDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
