import React, { useState } from "react";
import Logo from "../assets/logo.png";
import SidebarItem from "./SidebarItem";
import { BiHome, BiMenu, BiPencil, BiCalendar, BiGroup, BiMailSend, BiHelpCircle, BiSolidDetail } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { CgMoreVertical } from "react-icons/cg";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <aside
        className={`h-screen ${isCollapsed ? "w-20" : "w-[300px]"} transition-all duration-300`}
      >
        <nav
          className="h-full flex flex-col bg-white border-r shadow-sm"
          style={{ userSelect: "none" }}
        >
          {/* Logo ve Menü İkonu */}
          <div className={`${ isCollapsed ? "p-4 pb-2 flex justify-center" : "p-4 pb-2 flex justify-between"}`}>
            <img src={Logo} className={`w-12 ${isCollapsed ? "hidden" : "block"}`} alt="Logo" />
            <button onClick={toggleSidebar}>
              <BiMenu size={20} />
            </button>
          </div>

          {/* Menü Seçenekleri */}
          <ul className="flex-1 px-3">
            <SidebarItem icon={<BiHome size={20} />} text="Anasayfa" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiCalendar size={20} />} text="Takvim" active isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiPencil size={20} />} text="Yapılacaklar" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiMailSend size={20} />} text="Duyurular" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiGroup size={20} />} text="Gruplar" isCollapsed={isCollapsed} />
            <SidebarItem icon={<MdReport size={20} />} text="Raporlar" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiSolidDetail size={20} />} text="Proje Detayları" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BiHelpCircle size={20} />} text="Yardım" isCollapsed={isCollapsed} />
            <hr className="my-3" />
            <SidebarItem icon={<BsPerson size={20} />} text="Müşteri Bilgileri" isCollapsed={isCollapsed} />
          </ul>

          {/* Kullanıcı Bilgileri */}
          <div className="border-t flex items-center p-3">
            <img
              src={Logo}
              className={`w-10 h-10 rounded-md ${isCollapsed ? "hidden" : "block"}`}
              alt="Profile"
            />
            <div className={`flex justify-between items-center overflow-hidden w-52 ml-3 ${isCollapsed ? "hidden" : "block"}`}>
              <div className="leading-4">
                <h4>Username</h4>
              </div>
            </div>
            <CgMoreVertical size={20} />
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
