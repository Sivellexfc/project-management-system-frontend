import React, { useState } from "react";
import Logo from "../assets/logo.png";
import SidebarItem from "./SidebarItem";
/* ikon importları */
import {
  BiHome,
  BiMenu,
  BiPencil,
  BiCalendar,
  BiGroup,
  BiMailSend,
  BiHelpCircle,
  BiSolidDetail,
} from "react-icons/bi";

import { MdReport, MdSettings } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { CgMoreVertical } from "react-icons/cg";
import SidebarItemCanExpand from "./SidebarItemCanExpand";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { IoSettingsOutline } from "react-icons/io5";
import { PiProjectorScreenChartLight } from "react-icons/pi";

import { SettingsMenu } from "./SettingsMenu";
import {useAuth} from "../Context/AuthContext"

const Sidebar = () => {

  const { user } = useAuth();
  console.log(user)
  
  const menuItems = [
    {
      name: "Takvim",
      path: "/calender",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    {
      name: "Yapılacaklar",
      path: "/issues",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    {
      name: "Duyurular",
      path: "/announcement",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    {
      name: "Raporlar",
      path: "/reports",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    {
      name: "Yardım",
      path: "/help",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    {
      name: "Projeler",
      path: "/projects",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
    },
    { name: "Şirket", path: "/company", roles: ["COMPANY_OWNER"] }, // Sadece COMPANY_OWNER görecek
    { name: "Admin Panel", path: "/admin", roles: ["ADMIN"] }, // Sadece ADMIN görecek
  ];

  const [isOpen, setIsOpen] = useState(false);
  const accessToken = Cookies.get("accessToken");

  //const user = jwtDecode(accessToken);
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}"
  );

  const subItems = [
    { icon: <BsPerson size={20} />, text: "Üye" },
    { icon: <BsPerson size={20} />, text: "Üye" },
    { icon: <BsPerson size={20} />, text: "Üye" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex z-50">
      <aside
        className={`h-screen ${
          isCollapsed ? "w-20" : "w-[300px]"
        } transition-all duration-300`}
      >
        <nav
          className="h-full flex flex-col bg-white border-[#EEEEEE] border-r shadow-sm"
          style={{ userSelect: "none" }}
        >
          {/* Logo ve Menü İkonu */}
          <div
            className={`${
              isCollapsed
                ? "p-4 pb-2 flex justify-center"
                : "p-4 pb-2 flex justify-end"
            }`}
          >
            
            <button onClick={toggleSidebar}>
              <BiMenu size={30} />
            </button>
          </div>

          {/* Menü Seçenekleri */}
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<BiHome size={20} />}
              link={"dashboard"}
              text="Anasayfa"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BiCalendar size={20} />}
              link={"calendar"}
              text="Takvim"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BiPencil size={20} />}
              link={"issues"}
              text="Yapılacaklar"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BiMailSend size={20} />}
              link={"announcement"}
              text="Duyurular"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<PiProjectorScreenChartLight size={20} />}
              link={"projects"}
              text="Projeler"
              isCollapsed={isCollapsed}
            />

            <SidebarItemCanExpand
              icon={<BiGroup size={20} />}
              text="Gruplar"
              isCollapsed={isCollapsed}
              subItems={subItems}
            />

            <SidebarItem
              icon={<MdReport size={20} />}
              link={"reports"}
              text="Raporlar"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BiSolidDetail size={20} />}
              link={"projectDetails"}
              text="Proje Detayları"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BiHelpCircle size={20} />}
              link={"help"}
              text="Yardım"
              isCollapsed={isCollapsed}
            />
            <hr className=" border-borderColor" />
            <SidebarItem
              icon={<BsPerson size={20} />}
              text="Müşteri Bilgileri"
              isCollapsed={isCollapsed}
            />
          </ul>

          {/* Kullanıcı Bilgileri */}
          <div className="border-t border-borderColor flex items-center p-3">
            <img
              src={Logo}
              className={`w-10 h-10 rounded-md ${
                isCollapsed ? "hidden" : "block"
              }`}
              alt="Profile"
            />
            <div
              className={`flex justify-between items-center overflow-hidden w-52 ml-3 ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              <div className="leading-6 py-2 px-2">
                <div className="flex text-sm">
                  {/* <p>{selectedCompany.name || "Şirket Seçilmedi"}</p>

                  <p>{user.userFirstName} </p>
                  <p>{user.userLastName}</p> */}
                </div>
                {/* <h4 className="text-[#737373] text-sm">{user.userMail}</h4> */}
              </div>
            </div>
            <SettingsMenu></SettingsMenu>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
