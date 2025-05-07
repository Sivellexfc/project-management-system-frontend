import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const fetchData = async (companyId,projectId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get(`${API_URL}/${companyId}/project/${projectId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Token'ı header'a ekle
      },
    });

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
