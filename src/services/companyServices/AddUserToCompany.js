import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company/add"; // API URL'yi kendi API adresinle değiştir

export const addUserToCompany = async (key) => {
  try {
    const token = Cookies.get("accessToken");

    console.log("token :",token)

    const response = await axios.post(`${API_URL}/user?token=${encodeURIComponent(key)}`, {}, {
    });

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Şirkete ekleme hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
