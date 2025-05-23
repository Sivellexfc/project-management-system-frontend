import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const getIssueHistory = async (issueId) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.get(
      `${API_URL}/api/v1/issues/history/issue/${issueId}/desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Issue geçmişi alınırken hata oluştu:", error);
    throw error;
  }
}; 