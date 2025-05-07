import axios from 'axios';
import Cookie from "js-cookie"

const BASE_URL = "http://localhost:8085/api/v1/";

export const getProjectUsers = async (companyId, projectId) => {

    const token = Cookie.get("accessToken")
  try {
    const response = await axios.get(
      `${BASE_URL}company/${companyId}/project/${projectId}/users`,{
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