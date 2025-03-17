import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const createProject = async (name,description,endDate,groupIds,companyId) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.post(
      `${API_URL}/${companyId}/project`,
      {
        name: name,
        description: description,
        endDate: endDate,
        groupIds: groupIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      }
    );

    return response.data.result; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri post hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
