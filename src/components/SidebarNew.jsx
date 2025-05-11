import React, { useState } from "react";
import Logo from "../assets/logo.png";
import SidebarItem from "./SidebarItem";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaUserGroup } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";


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
import { GoPerson, GoProject } from "react-icons/go";
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
import { fetchGroups } from "../services/projectServices/GetGroups";
import { fetchSubGroups } from "../services/projectServices/GetSubGroups";
import { fetchUsersBySubGroupId } from "../services/projectServices/GetUsersBySubGroupId";
import { fetchUsersByGroupId } from "../services/projectServices/GetUsersByGroupId";

const SidebarNew = () => {
  const mockData = {
    projects: [
      {
        id: 1,
        name: "Proje 1",
        groups: [
          {
            id: 1,
            name: "Grup 1",
            subGroups: [
              {
                id: 1,
                name: "Alt Grup 1",
                users: [
                  { id: 1, fullName: "Ahmet Yılmaz" },
                  { id: 2, fullName: "Mehmet Demir" },
                ],
              },
              {
                id: 2,
                name: "Alt Grup 2",
                users: [
                  { id: 3, fullName: "Ayşe Kaya" },
                  { id: 4, fullName: "Fatma Şahin" },
                ],
              },
            ],
          },
          {
            id: 2,
            name: "Grup 2",
            subGroups: [
              {
                id: 3,
                name: "Alt Grup 3",
                users: [
                  { id: 5, fullName: "Ali Öztürk" },
                  { id: 6, fullName: "Zeynep Yıldız" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Proje 2",
        groups: [
          {
            id: 3,
            name: "Grup 3",
            subGroups: [
              {
                id: 4,
                name: "Alt Grup 4",
                users: [
                  { id: 7, fullName: "Can Yılmaz" },
                  { id: 8, fullName: "Deniz Demir" },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const companyId = Cookies.get("selectedCompanyId");
        const projectsData = await fetchData(companyId);
        console.log("projectsData  : ", projectsData);

        const projectsWithDetails = await Promise.all(
          projectsData.result.map(async (project) => {
            const groupsData = await fetchGroups(companyId, project.id);
            

            const groupsWithDetails = await Promise.all(
              groupsData.result.map(async (group) => {
                const subGroupsData = await fetchSubGroups(companyId, group.id);
                console.log("subGroupsData ", subGroupsData)
                console.log(subGroupsData.result)
                if (!subGroupsData.result || subGroupsData.result.length === 0) {
                
                  const usersData = await fetchUsersByGroupId(
                    companyId,
                    project.id,
                    group.id
                  );
                  return {
                    ...group,
                    subGroups: [],
                    users: usersData.result, // Doğrudan gruba kullanıcı ekle
                  };
                  // burada alt grup bulunmadığı için userlar API'den çekilecek 
                  // eğer user varsa grubun altına user eklenecek. 
                  // Çünkü alt-grubun bulunmadığı durumda o grupta doğrudan user bulunabilir.
                }
                const subGroupsWithDetails = await Promise.all(
                  subGroupsData.result.map(async (subGroup) => {

                    const usersData = await fetchUsersBySubGroupId(
                      companyId,
                      project.id,
                      subGroup.id
                    );

                    return {
                      ...subGroup,
                      users: usersData.result,
                    };
                  })
                );

                return {
                  ...group,
                  subGroups: subGroupsWithDetails,
                };
              })
            );

            return {
              ...project,
              groups: groupsWithDetails,
            };
          })
        );

        setProjects(projectsWithDetails);
        setLoading(false);
        console.log("PROJECTS",projectsWithDetails);
      } catch (err) {
        console.log(err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sidebarItems = [
    {
      text: "Projeler",
      icon: <FaLayerGroup />,
      subItems: projects.map((project) => ({
        text: project.name,
        icon: <GoProject />,
        path: `/project/kanbanBoard/${project.id}`,
        subItems: project.groups.map((group) => ({
          text: group.name,
          icon: <HiMiniUserGroup />,
          path: ``,
          subItems: group.subGroups.map((subGroup) => ({
            text: subGroup.name,
            icon: <FaUserGroup />,
            path: ``,
            subItems: subGroup.users.map((user) => ({
              text: user.user.firstName + " " + user.user.lastName,
              icon: <GoPerson />,
              path: ``,
              subItems: [],
            })),
          })),
        })),
      })),
    },
  ];

  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(Cookies.get("selectedCompanyId")); // Backend'den veri çekme
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
                : "p-4 pb-2 flex justify-between"
            }`}
          >
            <span className={`${
              !isCollapsed
                ? "text-2xl font-bold text-[#566AA6]"
                : "hidden"
            }`}>WORKDEN</span>
            <button onClick={toggleSidebar}>
            <RxHamburgerMenu size={24}/>
            </button>
          </div>

          <ul className="flex-1 px-3 mt-10">
            {filteredMenu.map((item) =>
              item.path === "/projects" ? (
                sidebarItems.map((subItem) => (
                  <SidebarItemCanExpand
                    key={subItem.text}
                    text={subItem.text}
                    icon={subItem.icon}
                    isCollapsed={isCollapsed}
                    subItems={subItem.subItems}
                  />
                ))
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
