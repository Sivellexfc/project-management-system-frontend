import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const deleteIssue = async (projectId, issueId) => {
  try {
    const token = Cookies.get("accessToken");
    const companyId = Cookies.get("selectedCompanyId");

    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.delete(
      `${API_URL}/api/v1/company/${companyId}/project/${projectId}/issues/${issueId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Issue silinirken hata oluştu:", error);
    throw error;
  }
}; 