import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import * as OwnerReportsServices from "../services/ReportServices/OwnerReportsServices";
import * as ProjectManagerReportsServices from "../services/reportServices/ProjectManagerReportsServices";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { fetchData } from "../services/projectServices/GetProjects";
import { myCompanies } from "../services/companyServices/GetMyCompanies";
import { getUserIssueReport } from "../services/userServices/GetUserIssueReport";
import { getUserPerformance } from "../services/userServices/GetUserPerformance";

// Klon veri
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "E-Ticaret Projesi",
    status: "ACTIVE",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    totalTasks: 5,
    completedTasks: 3,
  },
  {
    id: 2,
    name: "Mobil Uygulama",
    status: "COMPLETED",
    startDate: "2023-09-01",
    endDate: "2024-02-28",
    totalTasks: 4,
    completedTasks: 4,
  },
  {
    id: 3,
    name: "Web Sitesi Yenileme",
    status: "ACTIVE",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    totalTasks: 3,
    completedTasks: 1,
  },
];

const MOCK_EMPLOYEES = [
  { id: 1, name: "Ahmet Yılmaz", projects: 3, activeTasks: 8, totalTasks: 15 },
  { id: 2, name: "Mehmet Demir", projects: 2, activeTasks: 5, totalTasks: 10 },
  { id: 3, name: "Ayşe Kaya", projects: 3, activeTasks: 6, totalTasks: 12 },
  { id: 4, name: "Fatma Şahin", projects: 1, activeTasks: 3, totalTasks: 5 },
];

const MOCK_TASK_STATS = [
  { date: "2024-01", total: 12, completed: 8 },
  { date: "2024-02", total: 15, completed: 10 },
  { date: "2024-03", total: 18, completed: 12 },
  { date: "2024-04", total: 20, completed: 15 },
];
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CFE",
  "#F95C79",
  "#50D2C2",
  "#FF6384",
];

const Reports = () => {
  const [projectData, setProjectData] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectsToShow, setProjectsToShow] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userPerformances, setUserPerformances] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Token bulunamadı");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.userRole;
        const userId = decodedToken.userId;

        if (userRole === "COMPANY_OWNER" || userRole === "PROJECT_MANAGER") {
          const companyId = Cookies.get("selectedCompanyId");
          const projectCount =
            await OwnerReportsServices.getProjectCountByCompanyId(companyId);
          console.log(
            "Şirketin Proje Sayısı:",
            projectCount.result.projectCount
          );

          const companies = await myCompanies();
          console.log("myCompanies:", companies.result);
          setCompanyCount(companies.result.length);
          const projects = await fetchData(companyId);
          setProjectsToShow(projects.result);

          const userCount = await OwnerReportsServices.getUserCountByCompanyId(
            companyId
          );
          setUserCount(userCount.result.companyUserCount);
          console.log("Kullanıcı Sayısı:", userCount.result.companyUserCount);

          const projectIds = projects.result.map((project) => project.id);
          console.log("projectIds : ", projectIds);

          const issueCounts = await Promise.all(
            projectIds.map((pid) =>
              OwnerReportsServices.getIssueCountByStage(companyId, pid)
            )
          );
          console.log("Aşamalara Göre Görev Sayısı:", issueCounts);

          // Her proje için verileri düzenle
          const formattedData = issueCounts.map((projectData, index) => {
            // result içindeki verileri array'e çevir
            const stageData = Object.values(projectData.result || {});

            return {
              projectId: projectIds[index],
              data: stageData.map((item) => ({
                name: item.stageName || "Belirtilmemiş",
                value: item.issueCount || 0,
              })),
            };
          });

          console.log("Formatlanmış Veri:", formattedData);
          setProjectData(formattedData);

          // Kullanıcı performans verilerini çek
          const performances =
            await OwnerReportsServices.getAllUsersPerformances();
            console.log("performances : ",performances);
          setUserPerformances(performances.result);

        } else if (userRole === "USER") {
          try {
            // Görev raporunu al
            const issueReport = await getUserIssueReport();
            console.log("Görev Raporu:", issueReport);

            // Performans raporunu al
            const performanceReport = await getUserPerformance(userId);
            console.log("Performans Raporu:", performanceReport);
          } catch (error) {
            console.error("Kullanıcı raporları alınırken hata oluştu:", error);
          }
        }
      } catch (error) {
        console.error("Raporlar alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-borderColor p-3 rounded-full">
              <FaBuilding className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Şirket Sayısı</p>
              <p className="text-2xl font-bold text-gray-800">
                {companyCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-sky-100 p-3 rounded-full">
              <FaProjectDiagram className="text-sky-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Aktif Projeler</p>
              <p className="text-2xl font-bold text-gray-800">
                {projectsToShow?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaUser className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Çalışan</p>
              <p className="text-2xl font-bold text-gray-800">{userCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaTasks className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Görev Sayısı</p>
              <p className="text-2xl font-bold text-gray-800">
                {projectData?.length > 0 && (
                  <p className="text-xl font-bold text-gray-800">
                    {projectData.reduce((total, project) => {
                      return (
                        total +
                        project.data.reduce((sum, item) => sum + item.value, 0)
                      );
                    }, 0)}
                  </p>
                )}
              </p>
            </div>
          </div>
        </div>
        
      </div>

      {/* Kullanıcı Performans Tablosu */}
      <div className="bg-colorFirst border border-borderColor rounded-lg p-6 my-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Kullanıcı Performans Raporu
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Görev
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Erken Teslim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamanında Teslim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Geç Teslim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başarı Oranı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ort. Gün Farkı
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userPerformances.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.totalTasks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">
                      {user.earlyDeliveries} ({user.earlyDeliveryRate}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600">
                      {user.onTimeDeliveries} ({user.onTimeDeliveryRate}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      {user.lateDeliveries} ({user.lateDeliveryRate}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.successRate >= 80
                            ? "bg-green-100 text-green-800"
                            : user.successRate >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        user.averageDayDifference < 0
                          ? "text-green-600"
                          : user.averageDayDifference > 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {user.averageDayDifference > 0
                        ? `+${user.averageDayDifference}`
                        : user.averageDayDifference}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Çalışan Performansı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-10 ">
        {projectData.map((project, index) => {
          const filteredData = project.data.filter((item) => item.value > 0);
          const fullData = project.data;
          return (
            <div
              key={project.projectId}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">
                Proje{" "}
                {projectsToShow.find((item) => item.id === project.projectId)
                  ?.name || "Bulunamadı"}
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      // Etiketleri tamamen kaldırmak istersen label prop'unu kaldırabilirsin
                      // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {filteredData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {fullData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
