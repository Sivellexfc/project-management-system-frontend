import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8085/api/v1/company"; // API URL'yi kendi API adresinle değiştir

export const inviteUserToCompany = async (email,companyId) => {
  try {
    const token = Cookies.get("accessToken");

    console.log(token)
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.post(
      `${API_URL}/${companyId}/users/invite?email=${encodeURIComponent(email)}`,
      {}, // Boş bir body gönderiyoruz (eğer API bunu gerektiriyorsa)
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data; // Başarılı yanıtı dön
  } catch (error) {
    console.error("Davet linki gönderme hatası :", error);
    throw error; // Hata varsa yukarı ilet
  }
};
