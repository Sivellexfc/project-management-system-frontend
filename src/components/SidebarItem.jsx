import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setActiveItem } from "../app/features/sidebarSlice";

/**
 * 
 * Bu nesnenin alt seçenekleri yoktur. Tıklandığında doğrudan yönlendirir ve ilgili component render edilir.
 */

const SidebarItem = ({ icon, text, active, isCollapsed, subItems,link = [] }) => {

  const dispatch = useDispatch();
  const activeItem = useSelector((state) => state.sidebar.activeItem);

  const handleClick = () => {
    console.log("onclick sidebaritem is worked")
    dispatch(setActiveItem(link)); // Redux'taki aktif öğeyi güncelle
  };
  return (
    <>
      <li
        onClick={handleClick}
        className={""}
      >
        <NavLink
        to={link} 
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
          transition-colors group ${
            activeItem == link
              ? "bg-optionHoverColor"
              : "hover:bg-optionHoverColor text-gray-600"
          } ${isCollapsed ? "justify-center" : ""}`}>
          {icon}
          {!isCollapsed && (
            <span className="ml-2 text-base font-normal">{text}</span>
          )}
        </NavLink>
      </li>
    </>
  );
};

export default SidebarItem;
