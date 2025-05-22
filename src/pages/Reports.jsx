import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaChartPie,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });

  const projectStatusData = [
    {
      name: "Aktif Projeler",
      value: MOCK_PROJECTS.filter((p) => p.status === "ACTIVE").length,
    },
    {
      name: "Tamamlanan Projeler",
      value: MOCK_PROJECTS.filter((p) => p.status === "COMPLETED").length,
    },
  ];

  const taskStatusData = [
    {
      name: "Tamamlanan",
      value: MOCK_PROJECTS.reduce((acc, curr) => acc + curr.completedTasks, 0),
    },
    {
      name: "Devam Eden",
      value: MOCK_PROJECTS.reduce(
        (acc, curr) => acc + (curr.totalTasks - curr.completedTasks),
        0
      ),
    },
  ];

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

        if (userRole === "COMPANY_OWNER") {
          // Company Owner için raporlar
          
          // Örnek olarak ilk şirket için diğer raporları çekelim
            const companyId = Cookies.get("selectedCompanyId");
            const projectCount =
              await OwnerReportsServices.getProjectCountByCompanyId(companyId); // Örnek companyId
            console.log("Şirketin Proje Sayısı:", projectCount.result.projectCount);

            const companies = await myCompanies();
            console.log("myCompanies:", companies.result);

            //Burada projenin detaylarını dönüyor,
            // buradan sadece projenin adını çekeceğiz.
            // Ve bir alttaki veriyle iligli projeleri birleştireceğiz..
            const projects = await fetchData(companyId); // Örnek companyId
            console.log("projects:", projects.result); //burası bir array dönüyor.
            
            const userCount =
              await OwnerReportsServices.getUserCountByCompanyId(companyId); // Örnek companyId
            console.log("Kullanıcı Sayısı:", userCount.result.companyUserCount);

            const projectIds = projects.result.map((project) => project.id);
            const issueCounts = await Promise.all(
              projectIds.map((pid) =>
                OwnerReportsServices.getIssueCountByStage(companyId, pid)
              )
            );
            console.log("Aşamalara Göre Görev Sayısı:", issueCounts);
          
        } else if (userRole === "ROLE") {
          // Project Manager için raporlar
          const projectCount =
            await ProjectManagerReportsServices.getProjectCountByUserId(userId);
          console.log("Proje Sayısı:", projectCount);

          // Örnek olarak ilk proje için diğer raporları çekelim
          if (projectCount > 0) {
            const issueCount =
              await ProjectManagerReportsServices.getIssueCountByProjectId(1); // Örnek projectId
            console.log("Görev Sayısı:", issueCount);

            const issueCountByStage =
              await ProjectManagerReportsServices.getIssueCountByStage(1); // Örnek projectId
            console.log("Aşamalara Göre Görev Sayısı:", issueCountByStage);

            const userCount =
              await ProjectManagerReportsServices.getUserCountByProjectId(1); // Örnek projectId
            console.log("Projedeki Kullanıcı Sayısı:", userCount);
          }
        }
      } catch (error) {
        console.error("Raporlar alınırken hata oluştu:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span>-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaProjectDiagram className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Aktif Projeler</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_PROJECTS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaTasks className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Görev</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_PROJECTS.reduce((acc, curr) => acc + curr.totalTasks, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaTasks className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tamamlanan Görevler</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_PROJECTS.reduce((acc, curr) => acc + curr.completedTasks, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaChartBar className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tamamlanma Oranı</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(
                  (MOCK_PROJECTS.reduce(
                    (acc, curr) => acc + curr.completedTasks,
                    0
                  ) /
                    MOCK_PROJECTS.reduce(
                      (acc, curr) => acc + curr.totalTasks,
                      0
                    )) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaChartBar className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tamamlanma Oranı</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(
                  (MOCK_PROJECTS.reduce(
                    (acc, curr) => acc + curr.completedTasks,
                    0
                  ) /
                    MOCK_PROJECTS.reduce(
                      (acc, curr) => acc + curr.totalTasks,
                      0
                    )) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Çalışan</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_EMPLOYEES.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Çalışan</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_EMPLOYEES.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Toplam Çalışan</p>
              <p className="text-2xl font-bold text-gray-800">
                {MOCK_EMPLOYEES.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Proje Durumu */}
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Proje Durumu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Görev Durumu */}
        <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Görev Durumu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Görev İlerleme Grafiği */}
      <div className="bg-colorFirst border border-borderColor rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Görev İlerleme Trendi
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TASK_STATS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                name="Toplam Görev"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#82ca9d"
                name="Tamamlanan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Çalışan Performansı */}
      <div className="bg-colorFirst border border-borderColor rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Çalışan Performansı
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_EMPLOYEES}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="activeTasks" fill="#8884d8" name="Aktif Görevler" />
              <Bar dataKey="totalTasks" fill="#82ca9d" name="Toplam Görevler" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
