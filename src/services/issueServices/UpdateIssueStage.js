import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const updateIssueStage = async (projectId, issueId, stageType) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı");
    }
    const companyId = Cookies.get("selectedCompanyId");
    const response = await axios.patch(
      `${API_URL}/api/v1/company/${companyId}/project/${projectId}/issues/${issueId}/update-stage?type=${stageType}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Issue stage güncellenirken hata oluştu:", error);
    throw error;
  }
}; 