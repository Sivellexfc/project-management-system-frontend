import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/issues"; // API URL'yi kendi API adresinle değiştir

export const getStepsByIssueId = async (issueId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    const response = await axios.get(
      `${API_URL}/${issueId}/steps`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      }
    );

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri get hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
