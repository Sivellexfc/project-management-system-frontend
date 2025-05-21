import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaPlus, FaCalendarAlt, FaBuilding, FaUser, FaTimes, FaCheckCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded.userRole);
      setUserRole(decoded.userRole);
    }
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // API çağrısı şu an için yorum satırında
      const companyId = Cookies.get("selectedCompanyId");

      console.log("companyId : ", companyId)
      const response = await axios.get(
        `http://localhost:8085/api/v1/announcements/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("DUYURULAR : ", response.data)
      if (response.data.isSuccess) {
        setAnnouncements(response.data.result);
      } else {
        setError("Duyurular yüklenirken bir hata oluştu.");
      }

      // Örnek veri
      const mockData = [
        {
          id: 1,
          title: "Sistem Güncellemesi",
          content: "Yeni güncelleme ile performans iyileştirmeleri yapıldı. Kullanıcı deneyimi artırıldı ve hata düzeltmeleri gerçekleştirildi.",
          validUntil: "2024-04-01T23:59:59Z",
          isActive: true,
          imageUrl: "https://picsum.photos/800/400",
          companyName: "Tech A.Ş.",
          createdBy: "Ahmet Yılmaz"
        },
        {
          id: 2,
          title: "Yeni Özellik Duyurusu",
          content: "Proje yönetim sistemimize yeni özellikler eklendi. Kanban board ve zaman takibi gibi özellikler artık kullanımda.",
          validUntil: "2024-05-15T23:59:59Z",
          isActive: true,
          imageUrl: "https://picsum.photos/800/401",
          companyName: "Tech A.Ş.",
          createdBy: "Mehmet Demir"
        },
        {
          id: 3,
          title: "Bakım Çalışması",
          content: "Sistemimizde planlı bakım çalışması yapılacaktır. Lütfen çalışmalarınızı kaydetmeyi unutmayın.",
          validUntil: "2024-03-20T23:59:59Z",
          isActive: true,
          imageUrl: "https://picsum.photos/800/402",
          companyName: "Tech A.Ş.",
          createdBy: "Ayşe Kaya"
        }
      ];
      console.log(response.data)
      setLoading(false);
    } catch (err) {
      setError("Duyurular yüklenirken bir hata oluştu.");
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetail(true);
  };

  const handleCreateAnnouncement = () => {
    navigate("/announcement/create");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-colorFirst"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Duyurular</h1>
        {(userRole === "COMPANY_OWNER" || userRole === "ADMIN") && (
          <button
            onClick={handleCreateAnnouncement}
            className="flex items-center gap-2 bg-colorFirst text-primaryColor border border-borderColor font-light px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
            Yeni Duyuru
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            onClick={() => handleAnnouncementClick(announcement)}
            className="bg-white rounded-lg border border-borderColor overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            {announcement.photo && (
              <div className="relative h-48">
                <img
                  src={announcement.photo}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                {announcement.isActive && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaCheckCircle />
                    <span>Aktif</span>
                  </div>
                )}
              </div>
            )}
            <div className=" p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {announcement.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {announcement.content}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>{formatDate(announcement.validUntil)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBuilding />
                  <span>{announcement.companyName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUser />
                  <span>{announcement.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Henüz duyuru bulunmamaktadır.</p>
        </div>
      )}

      {/* Duyuru Detay Modalı */}
      {showDetail && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedAnnouncement.photo && (
              <div className="relative h-64">
                <img
                  src={selectedAnnouncement.photo}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedAnnouncement.title}
                </h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{formatDate(selectedAnnouncement.validUntil)}</span>
                  </div>
                </div>

                <div className="prose max-w-none min-h-[100px]">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedAnnouncement.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
