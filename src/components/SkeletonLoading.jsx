import React from "react";

function SkeletonLoading() {
  return (
    <div className="p-3 rounded-xl bg-white animate-pulse">
      <div className="w-full h-52 rounded-xl bg-gray-200 mb-2"></div>
      <div className="flex items-center gap-x-2 p-2">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        <div className="w-32 h-4 rounded-md bg-gray-200"></div>
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        <div className="w-20 h-4 rounded-md bg-gray-200"></div>
      </div>
      <div className="w-3/4 h-6 rounded-md bg-gray-200 ml-2"></div>
    </div>
  );
}

export default SkeletonLoading;
