import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company";

export const fetchUsersBySubGroupId = async (companyId, projectId, subGroupId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get(`${API_URL}/${companyId}/project/${projectId}/subgroup/${subGroupId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Kullanıcı verisi çekme hatası:", error);
    throw error;
  }
}; 