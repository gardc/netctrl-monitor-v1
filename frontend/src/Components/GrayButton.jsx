import React from "react";

export default function GrayButton({ onClick, children, ref }) {
  return (
    <button
      className="ml-2 px-8 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-500"
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
}
