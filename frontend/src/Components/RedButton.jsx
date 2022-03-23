import React from "react";

const RedButton = ({ onClick, children }, ref) => {
  return (
    <button
      className="ml-2 px-8 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-red-500"
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default React.forwardRef(RedButton);