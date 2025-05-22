import axios from 'axios';
import Cookie from "js-cookie";

const BASE_URL = "http://localhost:8085/api/v1/";

export const getCompanyCountByUserId = async (userId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}company/user/${userId}/company-count`,
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

export const getProjectCountByCompanyId = async (companyId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}company/${companyId}/project/project-count`,
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

export const getUserCountByCompanyId = async (companyId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}company/${companyId}/users/count`,
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

export const getIssueCountByStage = async (companyId, projectId) => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}company/${companyId}/project/${projectId}/issues/count-by-stage`,
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

export const getAllUsersPerformances = async () => {
    const token = Cookie.get("accessToken");
    try {
        const response = await axios.get(
            `${BASE_URL}user/performance`,
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


