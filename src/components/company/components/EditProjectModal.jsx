import React, { useState, useEffect } from "react";
import { FaPlus, FaUserPlus, FaEnvelope, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchData } from "../../../services/companyServices/GetCompanyEmployees";
import Cookies from "js-cookie";
import { createProject } from "../../../services/projectServices/CreateProject";
import { inviteProjectUser } from "../../../services/projectServices/InviteProjectUser";
import { getProjectUsers } from "../../../services/projectServices/GetProjectUsers";
import { getRandomColor } from "../../utils/GetRandomColor";
import { getInitials } from "../../utils/GetInitials";

// Fake kullanıcı verileri
const fakeUsers = [
  {
    id: 1,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    role: "Frontend Developer",
  },
  {
    id: 2,
    firstName: "Ayşe",
    lastName: "Kaya",
    email: "ayse.kaya@example.com",
    role: "Backend Developer",
  },
  {
    id: 3,
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@example.com",
    role: "UI/UX Designer",
  },
  {
    id: 4,
    firstName: "Zeynep",
    lastName: "Şahin",
    email: "zeynep.sahin@example.com",
    role: "Project Manager",
  },
  {
    id: 5,
    firstName: "Can",
    lastName: "Öztürk",
    email: "can.ozturk@example.com",
    role: "DevOps Engineer",
  },
  {
    id: 6,
    firstName: "Elif",
    lastName: "Aydın",
    email: "elif.aydin@example.com",
    role: "QA Engineer",
  },
  {
    id: 7,
    firstName: "Burak",
    lastName: "Çelik",
    email: "burak.celik@example.com",
    role: "Full Stack Developer",
  },
  {
    id: 8,
    firstName: "Selin",
    lastName: "Yıldız",
    email: "selin.yildiz@example.com",
    role: "Product Owner",
  },
];

const EditProjectModal = ({ closeModal, project }) => {
  const [companyUsers, setCompanyUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersToInvite, setUsersToInvite] = useState([]);

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

        setProjectUsers(result.result.map((item) => item.user));

        setLoading(false);
      } catch (error) {
        console.error("Proje kullanıcıları yüklenirken hata:", error);
        setLoading(false);
      }
    };

    const fetchCompanyUsers = async () => {
      try {
        const companyId = Cookies.get("selectedCompanyId");

        const response = await fetchData(companyId);
        console.log(response);
        setCompanyUsers(response.result);
        console.log("ŞİRKET KULLANICILARI ç: ", companyUsers);

        setLoading(false);
      } catch (error) {
        console.error("Proje kullanıcıları yüklenirken hata:", error);
        setLoading(false);
      }
    };

    fetchCompanyUsers();
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

  const handleUserSelect = (user) => {
    if (
      !projectUsers.some((pu) => pu.id === user.id) &&
      !usersToInvite.some((ui) => ui.id === user.id)
    ) {
      setUsersToInvite([...usersToInvite, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setProjectUsers(projectUsers.filter((id) => id !== userId));
    setUsersToInvite(usersToInvite.filter((user) => user.id !== userId));
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
      formData.append(
        "users",
        JSON.stringify([...projectUsers, ...usersToInvite])
      );

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
        [...projectUsers, ...usersToInvite]
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[1200px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Projeyi Düzenle</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
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
              <h3 className="text-lg font-semibold mb-4">Şirket Üyeleri</h3>

              {/* Kullanıcı Arama */}
              <div className="">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 p-2 text-sm text-primary text-opacity-70  rounded-lg  focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                      {user.photo && false ? (
                        <img
                          src={user.photo}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                            user.id
                          )}`}
                          title={`${user.firstName} ${user.lastName}`}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUserSelect(user)}
                      className={`p-2 rounded-full ${
                        projectUsers.includes(user.id) ||
                        usersToInvite.some((ui) => ui.id === user.id)
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      disabled={
                        projectUsers.includes(user.id) ||
                        usersToInvite.some((ui) => ui.id === user.id)
                      }
                    >
                      <FaUserPlus />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {/* Davet Etme */}
            <div className="">
              <h4 className="font-semibold text-lg  text-gray-700">
                Proje Üyeleri
              </h4>
              <div className="flex">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full flex-1 border border-gray-300 p-2 text-sm text-primary text-opacity-70  rounded-lg  focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="E-posta adresi girin"
                />
                <button
                  onClick={handleInviteUser}
                  className="px-4 py-3 bg-colorFirst border border-borderColor text-primary rounded-md hover:bg-borderColor hover:bg-opacity-25 flex items-center gap-2"
                >
                  <FaEnvelope />
                  Davet Et
                </button>
              </div>
            </div>

            {/* Proje Üyeleri */}
            <div className="">
              
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : projectUsers.length > 0 || usersToInvite.length > 0 ? (
                  <>
                    {projectUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {user.photo && false ? (
                            <img
                              src={user.photo}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                                user.id
                              )}`}
                              title={`${user.firstName} ${user.lastName}`}
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
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
                    ))}
                    {usersToInvite.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {user.photo && false ? (
                            <img
                              src={user.photo}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                                user.id
                              )}`}
                              title={`${user.firstName} ${user.lastName}`}
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                            <p className="text-xs text-blue-500">
                              Davet Edilecek
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Henüz proje üyesi bulunmuyor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-colorFirst text-primary border border-borderColor rounded-md hover:bg-borderColor hover:bg-opacity-25 font-md"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
