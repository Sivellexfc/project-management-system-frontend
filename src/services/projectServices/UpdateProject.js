import axios from "axios";
import Cookies from "js-cookie";

const API_PROJECT = "http://localhost:8085/api/v1/company";

export const createProject = async (
  name,
  description,
  photo,
  startDate,
  endDate,
  companyId,
  projectId
) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.post(
      `${API_PROJECT}/${companyId}/project/${projectId}`,
      {
        name:name,
        description:description,
        photo:"",
        startDate:startDate,
        endDate:endDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (!response.data?.result?.id) {
      throw new Error("Proje oluşturulamadı!");
    }

    return response.data;
  } catch (error) {
    console.error("Proje oluşturma hatası:", error);
    throw error;
  }
};
