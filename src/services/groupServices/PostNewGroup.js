import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const postData = async (title, companyId,color) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.post(
      `${API_URL}/${companyId}/group`,
      { name: title,color:color },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
      }
    );
    console.log("yanıt ", response.data)
    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Grup oluşturulurken hatayla karşılaşıldı :", error);
    throw error; // Hata varsa yukarı ilet
  }
};
