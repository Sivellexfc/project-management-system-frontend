import axios from "axios";
import Cookies from 'js-cookie';


const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const myCompanies = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get(
        `${API_URL}/me/companies`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
