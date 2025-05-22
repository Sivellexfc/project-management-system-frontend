import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {getUserDetails} from "./GetUserDetails.js";

export const createHelpComment = async (helpId, content) => {
  try {
    const token = Cookies.get("accessToken");
    const decodedToken = jwtDecode(token);
    const userDetails = await getUserDetails(decodedToken.userId);

    const commentData = {
      helpId: helpId,
      commenter: {
        userId: userDetails.result.id,
        firstName: userDetails.result.firstName,
        lastName: userDetails.result.lastName,
      },
      content: content,
    };

    const response = await axios.post(
      `http://localhost:8085/help-comments`,
      commentData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createHelpComment; 