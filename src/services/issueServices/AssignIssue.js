import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/issue-assignments"; // API URL'yi kendi API adresinle değiştir

export const assignIssue = async (
    issueId,
    assignedUserId,
    role
) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    console.log("issueId : ", issueId); 
    console.log("assignedUserId : ", assignedUserId);
    console.log("role : ", role);
    const response = await axios.post(
      `${API_URL}`,
      {
        issueId:issueId,
        assignedUserId:assignedUserId,
        role:role
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
