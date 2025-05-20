import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8085/api/v1/company";

export const createComment = async (
  companyId: string,
  projectId: string,
  issueId: number,
  commentText: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/${companyId}/project/${projectId}/issues/${issueId}/comments`,
      {
        commentText,
        issueId,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommentsByIssueId = async (
  companyId: string,
  projectId: string,
  issueId: number
) => {
  try {
    const response = await axios.get(
      `${API_URL}/${companyId}/project/${projectId}/issues/${issueId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (
  companyId: string,
  projectId: string,
  issueId: number,
  commentId: number
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/v1/company/${companyId}/project/${projectId}/issues/${issueId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}; 