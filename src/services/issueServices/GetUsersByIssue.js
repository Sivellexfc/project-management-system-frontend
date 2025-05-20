import axios from "axios";
import Cookie from "js-cookie";

const BASE_URL = "http://localhost:8085/api/v1/issue-assignments";

export const getUsersByIssue = async (issueId) => {
  try {
    const token = Cookie.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }
    const response = await axios.get(
      `${BASE_URL}/${issueId}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Veri get hatası:", error);
    throw error;
  }
};
