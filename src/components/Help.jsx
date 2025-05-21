import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaTag,
  FaUser,
  FaClock,
  FaComment,
} from "react-icons/fa";
import CreateHelpModal from "./Help/CreateHelpModal";
import HelpCard from "./Help/HelpCard";
import { fetchHelps } from "../services/helpServices/GetHelpsByProjectId";
import { getMyProjects } from "../services/projectServices/GetMyProjects";
import Cookies from "js-cookie";
import { fetchData } from "../services/projectServices/GetProjects";

const MOCK_HELPS = [
  {
    id: 1,
    user: {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
    },
    projectId: 101,
    title: "Spring Boot API hatası",
    description: "Veritabanı bağlantısında hata alıyorum.",
    priority: "HIGH",
    helpstatus: "IN_PROGRESS",
    language: "JAVA",
    updatedAt: "2024-03-03T12:30:00",
    screenshotUrls: [
      "https://example.com/screenshot1.png",
      "https://example.com/screenshot2.png",
    ],
    logFileUrls: [
      "https://example.com/log1.txt",
      "https://example.com/log2.txt",
    ],
    codeSnippet:
      'public static void main(String[] args) { System.out.println("Hello World"); }',
    mentions: [
      {
        userId: 2,
        firstName: "Alice",
        lastName: "Smith",
      },
    ],
    tags: ["BACKEND", "DATABASE"],
    comments: [
      {
        id: 1,
        helpId: 1,
        commenter: {
          userId: 2,
          firstName: "Alice",
          lastName: "Smith",
          photoUrl: "https://example.com/profile/alice_smith.jpg",
        },
        content: "Öncelikle driverların güncel mi?",
        createdAt: "2024-03-03T13:00:00",
      },
      {
        id: 1,
        helpId: 1,
        commenter: {
          userId: 2,
          firstName: "Alice",
          lastName: "Smith",
          photoUrl: "https://example.com/profile/alice_smith.jpg",
        },
        content: "Driverları güncelle",
        createdAt: "2024-03-03T13:00:00",
      },
    ],
  },
];

const MOCK_PROJECTS = [
  { id: 101, name: "Proje A" },
  { id: 102, name: "Proje B" },
  { id: 103, name: "Proje C" },
];

const Help = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [helps, setHelps] = useState([]);

  const filteredHelps = helps.filter((help) => {
    const matchesSearch =
      help.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      help.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      help.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesProject =
      selectedProject === "all" || help.projectId === parseInt(selectedProject);

    return matchesSearch && matchesProject;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetchData(Cookies.get("selectedCompanyId"));
        const projects = response.result;
        // Her proje için help verilerini çek
        for (const project of projects) {
          const helpRequests = projects.map((project) =>
            fetchHelps(project.id)
          );

          // Paralel olarak hepsini bekle
          const helpsPerProject = await Promise.all(helpRequests);

          // Tüm helps'leri tek bir diziye düzle
          const allHelps = helpsPerProject.flat();

          // State'e ata
          setHelps(allHelps);
          console.log("All Helps:", allHelps);
        }
      } catch (error) {
        console.error("Projeler veya raporlar alınırken hata oluştu:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="w-full p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-primary text-3xl font-semibold">
            Destek talepleri
          </h1>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 justify-between">
          <div className="flex-1 relative max-w-[600px]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Destek taleplerinde ara..."
              className="w-full pl-10 pr-4 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Projeler</option>
                {MOCK_PROJECTS.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center border border-borderColor gap-2 px-4 py-2 bg-colorFirst rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus />
              <span className="font-primary">Yeni Destek Talebi</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Help List */}
        <div className="space-y-4">
          {filteredHelps.map((help) => (
            <HelpCard key={help.id} help={help} />
          ))}
        </div>

        {/* Create Help Modal */}
        {isModalOpen && (
          <CreateHelpModal
            closeModal={() => setIsModalOpen(false)}
            projects={MOCK_PROJECTS}
          />
        )}
      </div>
    </div>
  );
};

export default Help;
