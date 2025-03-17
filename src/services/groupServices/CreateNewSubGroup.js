import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const createSubGroup = async (companyId, groupId,name,color) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    console.log("companyId id : "+companyId)
    console.log("grup id : "+groupId)
    console.log("name id : "+name)
    console.log("color id : "+color)
    const response = await axios.post(
      `${API_URL}/${companyId}/group/${groupId}/subgroup`,
      {
        name: name,
        color: color,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      }
    );

    return response.data.result; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error; // Hata varsa yukarı ilet
  }
};
