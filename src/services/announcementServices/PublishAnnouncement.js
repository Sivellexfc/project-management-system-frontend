import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/announcements"; // API URL'yi kendi API adresinle değiştir

export const publishAnnouncement = async (companyId) => {
  try {
    const token = Cookies.get("accessToken");

    const response = await axios.post(`${API_URL}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      });

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Şirkete ekleme hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
