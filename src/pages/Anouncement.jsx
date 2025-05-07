import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaPlus, FaCalendarAlt, FaBuilding, FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Anouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

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

      const response = await axios.get(
        `http://localhost:8085/api/v1/announcements/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("response : ", response)
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

  const handleAnnouncementClick = (id) => {
    navigate(`/announcement/${id}`);
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
            onClick={() => handleAnnouncementClick(announcement.id)}
            className="bg-white rounded-lg border border-borderColor overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            {announcement.imageUrl && (
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {announcement.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
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
    </div>
  );
};

export default Anouncement;
