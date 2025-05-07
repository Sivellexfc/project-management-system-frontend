import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:8085/api/v1/";

export const getGroupUsers = async (companyId, projectId, groupId) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.get(
      `${BASE_URL}company/${companyId}/project/${projectId}/group/${groupId}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}; 