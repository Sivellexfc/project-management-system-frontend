import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company";

export const fetchGroups = async (companyId, projectId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get(`${API_URL}/${companyId}/group/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Grup verisi çekme hatası:", error);
    throw error;
  }
}; 