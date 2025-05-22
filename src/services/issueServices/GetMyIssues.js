import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getMyProjects } from "../projectServices/GetMyProjects";

const API_URL = "http://localhost:8085/api/v1/issue-assignments"; // API URL'yi kendi API adresinle değiştir

export const getMyIssues = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) throw new Error("Token bulunamadı!");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const response = await getMyProjects(Cookies.get("selectedCompanyId"));

    if (!response.isSuccess) {
      throw new Error("Proje bilgileri alınamadı.");
    }

    const projects = response.result;
    const allIssues = [];

    for (const project of projects) {
      try {
        const res = await axios.get(
          `${API_URL}/user/${userId}/project/${project.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        allIssues.push({
          projectId: project.id,
          projectName: project.name,
          issues: res.data.result, // issue datası genelde `result` içinde olur
        });

      } catch (error) {
        console.error(`Proje ${project.id} için istek hatası:`, error);
      }
    }

    return allIssues;
  } catch (error) {
    console.error("Veri getirme hatası:", error);
    throw error;
  }
};

