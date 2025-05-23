import React, { useState } from "react";
import { BiArrowToBottom } from "react-icons/bi";
import { BsArrowsExpand } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarItemCanExpand = ({
  icon,
  text,
  active,
  isCollapsed,
  subItems = [],
  path,
  depth = 0,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMainClick = (e) => {
    e.preventDefault(); // Default yönlendirmeyi engelle
    console.log("yönlendiriyorum",path)
    if(path) {
      navigate(path);
    }
     
  };

  const paddingLeft = isCollapsed ? "" : `pl-${Math.min(depth * 4, 12)}`;

  return (
    <>
      <li
        onClick={handleMainClick}
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
          transition-colors group ${
            active
              ? "bg-bg-sky-100"
              : "hover:bg-sky-100 text-primary text-opacity-70"
          } ${isCollapsed ? "justify-center" : ""} ${paddingLeft}`}
      >
        {icon}
        {!isCollapsed && (
          <div className="flex flex-row w-full justify-between items-center">
            <span className="ml-2 text-sm font-normal">{text}</span>
            {subItems.length > 0 && (
              <div className="p-1 rounded-lg  hover:bg-sky-200">
                <MdOutlineKeyboardArrowDown onClick={toggleExpand} />
              </div>
            )}
          </div>
        )}
      </li>

      {isExpanded && !isCollapsed && subItems.length > 0 && (
        <ul className="ml-4">
          {subItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.subItems ? (
                <SidebarItemCanExpand
                  icon={item.icon}
                  text={item.text}
                  path={item.path}
                  active={item.active}
                  subItems={item.subItems}
                  isCollapsed={isCollapsed}
                  depth={depth + 1}
                />
              ) : (
                <NavLink to={item.path}>
                  <li
                    className="flex items-center py-2 px-3 my-1 font-normal rounded-md cursor-pointer 
                      text-gray-600 hover:bg-indigo-50"
                  >
                    {item.icon}
                    <span className="ml-2 text-sm">{item.text}</span>
                  </li>
                </NavLink>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarItemCanExpand;
