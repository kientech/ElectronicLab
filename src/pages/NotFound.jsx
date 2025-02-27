// pages/NotFound.js
import React from "react";

const NotFound = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="text-blue-500 hover:text-blue-700 underline mt-6 block"
      >
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
