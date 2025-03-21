import React, { useState } from "react";
import { BiArrowToBottom } from "react-icons/bi";
import { BsArrowsExpand } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";

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
  path
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
          <div className="flex flex-row w-full justify-between items-center">
            <span className="ml-2 text-sm font-normal">{text}</span>
            <MdOutlineKeyboardArrowDown/>
          </div>
          
        )}
      </li>
      {isExpanded && !isCollapsed && (
        <ul className="ml-4">
          {subItems.map((subItem, index) => (
            <NavLink to={"/project/kanbanBoard"}>
              <li
              key={index}
              className="flex items-center py-2 px-3 my-1 font-normal rounded-md cursor-pointer 
                text-gray-600 hover:bg-indigo-50"
            >
              {subItem.icon}
              <span className="ml-2 text-sm">{subItem.text}</span>
            </li>
            </NavLink>
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarItemCanExpand;
