import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:8085/api/v1/";

export const getSubgroups = async (companyId, groupId) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.get(
      `${BASE_URL}company/${companyId}/group/${groupId}/subgroup`,
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
