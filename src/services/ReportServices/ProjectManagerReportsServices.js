import axios from 'axios';
import Cookie from "js-cookie";

const BASE_URL = "http://localhost:8085/api/v1/";

export const getProjectCountByUserId = async (userId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}project/user/${userId}/project-count`,
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

export const getIssueCountByProjectId = async (projectId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}project/${projectId}/issues/count`,
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

export const getIssueCountByStage = async (projectId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}project/${projectId}/issues/count-by-stage`,
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

export const getUserCountByProjectId = async (projectId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}project/${projectId}/users/count`,
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