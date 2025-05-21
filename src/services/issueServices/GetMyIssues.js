import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8085/api/v1/issue-assignments"; // API URL'yi kendi API adresinle değiştir

export const getMyIssues = async (projectId) => {
  try {
    const token = Cookies.get("accessToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    
    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    const response = await axios.get(
      `${API_URL}/user/${userId}/project/${projectId}`,
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
