import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1";

export const getUserDetails = async (userId) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Kullanıcı detayları alınırken hata oluştu:", error);
    throw error;
  }
}; 