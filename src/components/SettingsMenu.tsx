import React, { useEffect, useRef, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { NotificationPanel } from "./NotificationPanel";

export const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("selectedCompanyId");
    localStorage.removeItem("selectedCompany");
    
    navigate("/home");
  };

  return (
    <div className="flex items-center gap-4">
      <NotificationPanel />
      <div
        className="opacity-70 hover:opacity-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoSettingsOutline size={20} />
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute transform  -translate-y-full mt-2 w-40 bg-white shadow-lg rounded-lg p-2 border"
        >
          <ul className="text-sm text-gray-700">
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Profil</li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer text-red-500">
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600"
              >
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
