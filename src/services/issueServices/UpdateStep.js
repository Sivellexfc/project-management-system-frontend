import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const updateStep = async (issueId, issueStepId, data) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.put(
      `${API_URL}/api/v1/issues/${issueId}/steps/${issueStepId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Adım güncellenirken hata oluştu:", error);
    throw error;
  }
};
