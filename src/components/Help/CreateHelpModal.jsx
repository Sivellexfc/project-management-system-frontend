import React, { useEffect, useState } from "react";
import { FaTimes, FaUpload, FaTag, FaUser, FaCode } from "react-icons/fa";
import { fetchData } from "../../services/projectServices/GetProjects";
import Cookies from "js-cookie";
import createHelp from "../../services/helpServices/CreateHelp";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const LANGUAGES = [
  "JAVA",
  "PYTHON",
  "JAVASCRIPT",
  "C#",
  "PHP",
  "RUBY",
  "GO",
  "OTHER",
];

const TAGS = [
  "OTHER",
  "FRONTEND",
  "BACKEND",
  "AI",
  "DATABASE",
  "DEVOPS",
  "SECURITY",
  "MOBILE",
];

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const CreateHelpModal = ({ closeModal, projects }) => {
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    helpstatus: "OPEN",
    language: "",
    codeSnippet: "",
    mentions: [],
    tags: [],
  });

  const [photo, setPhoto] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newMention, setNewMention] = useState("");
  const [projectsToShow, setProjectsToShow] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetchData(Cookies.get("selectedCompanyId"));
        const projects = response.result;
        setProjectsToShow(projects);
      } catch (error) {
        console.error("Projeler veya raporlar alınırken hata oluştu:", error);
      }
    };

    fetchProjects();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz!");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Lütfen bir resim dosyası seçin!");
        return;
      }
      setPhoto(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    // Burada dosya yükleme işlemi yapılacak
    console.log("Uploaded files:", files);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    } else {
      setSelectedTags(prev => [...prev, tag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createHelp(formData, photo);
    console.log("response:", response);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Yeni Destek Talebi
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Proje Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proje
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Proje Seçin</option>
                {projectsToShow.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Öncelik ve Durum */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  name="helpstatus"
                  value={formData.helpstatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Programlama Dili */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programlama Dili
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Dil Seçin</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosya Yükleme */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotoğraf
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <FaUpload />
                    <span>{photo ? photo.name : 'Fotoğraf Seç'}</span>
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                {photo && (
                  <div className="mt-2 text-sm text-gray-500">
                    Seçilen dosya: {photo.name} ({(photo.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Dosyaları
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    accept=".txt,.log"
                    onChange={(e) => handleFileUpload(e, "log")}
                    className="hidden"
                    id="log-upload"
                  />
                  <label
                    htmlFor="log-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <FaUpload />
                    <span>Dosya Seç</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Kod Parçası */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kod Parçası
              </label>
              <textarea
                name="codeSnippet"
                value={formData.codeSnippet}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>

            {/* Etiketler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaTag className="inline mr-2" />
                Etiketler
              </label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${selectedTags.includes(tag)
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Seçilen etiketler: {selectedTags.join(", ")}
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-colorSecond text-primary border border-borderColor rounded-md hover:bg-gray-100 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-colorFirst text-primary border border-borderColor rounded-md hover:bg-colorFirst transition-colors"
              >
                Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHelpModal;
