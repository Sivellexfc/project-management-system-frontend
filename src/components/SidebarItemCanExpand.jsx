import React, { useState } from "react";



/**
 * 
 * Bu nesne üzerine tıklandığında alt seçenekleriyle beraber gelir.
 */
const SidebarItemCanExpand = ({
  icon,
  text,
  active,
  isCollapsed,
  subItems = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <li
        onClick={toggleExpand}
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
          transition-colors group ${
            active
              ? "bg-optionHoverColor"
              : "hover:bg-optionHoverColor text-gray-600"
          } ${isCollapsed ? "justify-center" : ""}`}
      >
        {icon}
        {!isCollapsed && (
          <span className="ml-2 text-sm font-normal">{text}</span>
        )}
      </li>
      {isExpanded && !isCollapsed && (
        <ul className="ml-4">
          {subItems.map((subItem, index) => (
            <li
              key={index}
              className="flex items-center py-2 px-3 my-1 font-normal rounded-md cursor-pointer 
                text-gray-600 hover:bg-indigo-50"
            >
              {subItem.icon}
              <span className="ml-2 text-sm">{subItem.text}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarItemCanExpand;
