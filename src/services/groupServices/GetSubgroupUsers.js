import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:8085/api/v1/";

export const getSubgroupUsers = async (companyId, projectId, subgroupId) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.get(
      `${BASE_URL}company/${companyId}/project/${projectId}/subgroup/${subgroupId}/users`,
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