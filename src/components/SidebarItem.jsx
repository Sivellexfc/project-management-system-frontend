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
        to={link} className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
          transition-colors group ${
            activeItem == link
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-900"
              : "hover:bg-indigo-50 text-gray-600"
          } ${isCollapsed ? "justify-center" : ""}`}>
          {icon}
          {!isCollapsed && (
            <span className="ml-2 text-sm font-normal">{text}</span>
          )}
        </NavLink>
      </li>
    </>
  );
};

export default SidebarItem;
