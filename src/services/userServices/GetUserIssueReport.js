import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const getUserIssueReport = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.get(
      `${API_URL}/api/v1/issue-assignments/user/issue-report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Görev raporu alınırken hata oluştu:", error);
    throw error;
  }
}; 