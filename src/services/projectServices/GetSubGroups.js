import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company";

export const fetchSubGroups = async (companyId, groupId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get(`${API_URL}/${companyId}/group/${groupId}/subgroup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Alt grup verisi çekme hatası:", error);
    throw error;
  }
}; 