import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const createIssue = async (companyId,name,description,startDate,deadLineDate,stageId,projectId,priorityId,labelId) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    const response = await axios.post(
      `${API_URL}/${companyId}/project/${projectId}/issues`,
      {
        name: name,
        explanation: description,
        startDate:startDate,
        deadLineDate:deadLineDate,
        stageId:stageId,
        projectId:projectId,
        priorityId:priorityId,
        labelId:labelId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      }
    );

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri post hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
