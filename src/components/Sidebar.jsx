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

import { MdReport } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { CgMoreVertical } from "react-icons/cg";
import SidebarItemCanExpand from "./SidebarItemCanExpand";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const accessToken = Cookies.get("accessToken");

  console.log("token :" + JSON.stringify(accessToken, null, 2));
  const user = jwtDecode(accessToken);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Sidebar üzerinde bulunan alt başlığa sahip olan seçenekler için bir örnek data
   * (burada "Gruplar" için bir örnek subItems bulunuyor)
   */
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
          className="h-full flex flex-col bg-white border-r shadow-sm"
          style={{ userSelect: "none" }}
        >
          {/* Logo ve Menü İkonu */}
          <div
            className={`${
              isCollapsed
                ? "p-4 pb-2 flex justify-center"
                : "p-4 pb-2 flex justify-between"
            }`}
          >
            <img
              src={Logo}
              className={`w-12 ${isCollapsed ? "hidden" : "block"}`}
              alt="Logo"
            />
            <button onClick={toggleSidebar}>
              <BiMenu size={20} />
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
            <hr className="my-3" />
            <SidebarItem
              icon={<BsPerson size={20} />}
              text="Müşteri Bilgileri"
              isCollapsed={isCollapsed}
            />
          </ul>

          {/* Kullanıcı Bilgileri */}
          <div className="border-t flex items-center p-3">
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
              <div className="leading-6">
                <h4>{user.userMail}</h4>
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
