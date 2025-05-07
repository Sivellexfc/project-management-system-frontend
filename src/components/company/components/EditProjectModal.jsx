import React, { useState, useEffect } from "react";
import { FaPlus, FaUserPlus, FaEnvelope, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchData } from "../../../services/projectServices/GetProjects";
import Cookies from "js-cookie";
import { createProject } from "../../../services/projectServices/CreateProject";
import { inviteProjectUser } from "../../../services/projectServices/InviteProjectUser";
import { getProjectUsers } from "../../../services/projectServices/GetProjectUsers";

// Fake kullanıcı verileri
const fakeUsers = [
  {
    id: 1,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    role: "Frontend Developer"
  },
  {
    id: 2,
    firstName: "Ayşe",
    lastName: "Kaya",
    email: "ayse.kaya@example.com",
    role: "Backend Developer"
  },
  {
    id: 3,
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@example.com",
    role: "UI/UX Designer"
  },
  {
    id: 4,
    firstName: "Zeynep",
    lastName: "Şahin",
    email: "zeynep.sahin@example.com",
    role: "Project Manager"
  },
  {
    id: 5,
    firstName: "Can",
    lastName: "Öztürk",
    email: "can.ozturk@example.com",
    role: "DevOps Engineer"
  },
  {
    id: 6,
    firstName: "Elif",
    lastName: "Aydın",
    email: "elif.aydin@example.com",
    role: "QA Engineer"
  },
  {
    id: 7,
    firstName: "Burak",
    lastName: "Çelik",
    email: "burak.celik@example.com",
    role: "Full Stack Developer"
  },
  {
    id: 8,
    firstName: "Selin",
    lastName: "Yıldız",
    email: "selin.yildiz@example.com",
    role: "Product Owner"
  }
];

const EditProjectModal = ({ closeModal, project }) => {
  const [companyUsers, setCompanyUsers] = useState(fakeUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proje bilgileri
  const [title, setTitle] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(project.photo);
  const [startDate, setStartDate] = useState(new Date(project.startDate));
  const [endDate, setEndDate] = useState(new Date(project.endDate));

  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const companyId = Cookies.get("selectedCompanyId");
        const result = await getProjectUsers(companyId, project.id);
        
        setProjectUsers(result.result.map(item => item.user));
        

        setLoading(false);
      } catch (error) {
        console.error("Proje kullanıcıları yüklenirken hata:", error);
        setLoading(false);
      }
    };

    fetchProjectUsers();
  }, [project.id]);

  const filteredUsers = companyUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "startDate",
        new Date(startDate).toISOString().split("T")[0]
      );
      formData.append("endDate", new Date(endDate).toISOString().split("T")[0]);
      formData.append("companyId", Cookies.get("selectedCompanyId"));
      formData.append("users", JSON.stringify(projectUsers));

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await createProject(
        title,
        description,
        photo,
        new Date(startDate).toISOString().split("T")[0],
        new Date(endDate).toISOString().split("T")[0],
        Cookies.get("selectedCompanyId"),
        projectUsers
      );

      console.log(response);
      alert("Proje başarıyla güncellendi!");
      closeModal();
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleInviteUser = async () => {
    if (inviteEmail && !projectUsers.includes(inviteEmail)) {
      try {
        await inviteProjectUser(
          Cookies.get("selectedCompanyId"),
          project.id,
          inviteEmail
        );
        setProjectUsers([...projectUsers, inviteEmail]);
        setInviteEmail("");
        alert("Davet başarıyla gönderildi!");
      } catch (error) {
        console.error("Davet gönderme hatası:", error);
        alert("Davet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleRemoveUser = (userId) => {
    setProjectUsers(projectUsers.filter((id) => id !== userId));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[1200px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Projeyi Düzenle
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Sol Taraf - Proje Bilgileri */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proje Adı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Proje adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Proje açıklamasını girin"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proje Logosu
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Proje logosu"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaPlus className="text-gray-400 text-2xl" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Maksimum 5MB boyutunda resim dosyası yükleyebilirsiniz.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholderText="Başlangıç tarihi seçin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholderText="Bitiş tarihi seçin"
                />
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Kullanıcı Yönetimi */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Proje Üyeleri</h3>
              
              {/* Kullanıcı Arama */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı ara..."
                />
              </div>

              {/* Kullanıcı Listesi */}
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!projectUsers.includes(user.id)) {
                          setProjectUsers([...projectUsers, user.id]);
                        }
                      }}
                      className={`p-2 rounded-full ${
                        projectUsers.includes(user.id)
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      disabled={projectUsers.includes(user.id)}
                    >
                      <FaUserPlus />
                    </button>
                  </div>
                ))}
              </div>

              {/* Davet Etme */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  E-posta ile Davet Et
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-posta adresi girin"
                  />
                  <button
                    onClick={handleInviteUser}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaEnvelope />
                    Davet Et
                  </button>
                </div>
              </div>

              {/* Proje Üyeleri */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Proje Üyeleri
                </h4>
                <div className="space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : projectUsers.length > 0 ? (
                    projectUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Henüz proje üyesi bulunmuyor.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal; 