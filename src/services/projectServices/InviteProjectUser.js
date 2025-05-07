import axios from 'axios';

const BASE_URL = "http://localhost:8085/api/v1/";

export const inviteProjectUser = async (companyId, projectId, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}company/${companyId}/project/${projectId}/user/send?email=${email}`
    );
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
}; 