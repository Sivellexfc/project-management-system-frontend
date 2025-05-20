import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085";

export const getNotificationsByRecipientId = async (recipientId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/notifications/${recipientId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Bildirimler alınırken hata oluştu:", error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (recipientId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/notifications/${recipientId}/count-unread?status=READ`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Okunmamış bildirim sayısı alınırken hata oluştu:", error);
    throw error;
  }
};

export const getNotificationsByStatus = async (recipientId: number, status: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/notifications/${recipientId}/status?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Duruma göre bildirimler alınırken hata oluştu:", error);
    throw error;
  }
}; 