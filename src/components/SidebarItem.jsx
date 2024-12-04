import React, { useState } from "react";

const SidebarItem = ({ icon, text, active, isCollapsed, subItems = [] }) => {
  
  return (
    <>

      <li
        onClick={null}
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
          transition-colors group ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-900"
              : "hover:bg-indigo-50 text-gray-600"
          } ${
            isCollapsed
              ? "justify-center"
              : ""
          }`}
      >
        {icon}
        {!isCollapsed && <span className="ml-2 text-sm font-normal">{text}</span>}
      </li>


    </>
  );
};

export default SidebarItem;
