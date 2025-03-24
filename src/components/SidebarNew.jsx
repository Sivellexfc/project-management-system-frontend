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
import { SettingsMenu } from "./SettingsMenu";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { GoProject } from "react-icons/go";
import { VscGithubProject } from "react-icons/vsc";

import {
  PiProjectorScreenChart,
  PiProjectorScreenChartLight,
} from "react-icons/pi";

import {
  FaCalendarAlt,
  FaTasks,
  FaBullhorn,
  FaChartBar,
  FaQuestionCircle,
  FaBuilding,
  FaUserShield,
} from "react-icons/fa";
import { fetchData } from "../services/projectServices/GetProjects";
import { useEffect } from "react";

const SidebarNew = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("3"); // Backend'den veri çekme
        setData(result.result);
        console.log(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  const menuItems = [
    {
      name: "Takvim",
      path: "/calendar",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <FaCalendarAlt />,
    },
    {
      name: "Yapılacaklar",
      path: "/issues",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <FaTasks />,
    },
    {
      name: "Duyurular",
      path: "/announcement",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <FaBullhorn />,
    },
    {
      name: "Raporlar",
      path: "/reports",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <FaChartBar />,
    },
    {
      name: "Projeler",
      path: "/projects",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <PiProjectorScreenChart />,
    },
    {
      name: "Yardım",
      path: "/help",
      roles: ["USER", "ADMIN", "COMPANY_OWNER"],
      icon: <FaQuestionCircle />,
    },
    {
      name: "Şirket",
      path: "/company",
      roles: ["COMPANY_OWNER", "ADMIN"],
      icon: <FaBuilding />,
    }, // Sadece COMPANY_OWNER görecek
    {
      name: "Admin Panel",
      path: "/admin",
      roles: ["ADMIN"],
      icon: <FaUserShield />,
    }, // Sadece ADMIN görecek
  ];

  const accessToken = Cookies.get("accessToken");
  const userinfos = jwtDecode(accessToken);

  console.log(userinfos);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}"
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userinfos.userRole)
  );

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

          <ul className="flex-1 px-3">
            {filteredMenu.map((item) =>
              item.path === "/projects" ? (
                <SidebarItemCanExpand
                  key={item.path}
                  text="Projeler"
                  icon={<VscGithubProject />}
                  isCollapsed={isCollapsed}
                  subItems={
                    data?.length > 0
                      ? data.map((project) => ({
                          text: project.name, // Proje adını subItem olarak ekliyoruz
                          icon: <GoProject />, // Proje ikonunu ekliyoruz
                          path: `/project/kanbanBoard/${project.id}`, // Her proje için dinamik path ekledik
                        }))
                      : [{ text: "Projeler bulunamadı", icon: null, path: "#" }]
                  }
                />
              ) : (
                <SidebarItem
                  key={item.path}
                  text={item.name}
                  icon={item.icon}
                  link={item.path}
                  isCollapsed={isCollapsed}
                />
              )
            )}
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
                  <p>{selectedCompany.name || "Şirket Seçilmedi"}</p>
                  <p>{userinfos.userFirstName} </p>
                  <p>{userinfos.userLastName}</p>
                </div>
                <h4 className="text-[#737373] text-sm">{userinfos.userMail}</h4>
              </div>
            </div>
            <SettingsMenu></SettingsMenu>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default SidebarNew;
