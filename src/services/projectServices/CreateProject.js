import axios from "axios";
import Cookies from "js-cookie";

const API_PROJECT = "http://localhost:8085/api/v1/company";
const API_GROUP = "http://localhost:8085/api/v1/company";

export const createProject = async (
  title,
  description,
  photo,
  startDate,
  endDate,
  companyId,
  groups
) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    // FormData oluştur
    const formData = new FormData();

    formData.append("request", new Blob([JSON.stringify({
      name: title,
      description,
      startDate,
      endDate,
      projectStatus: "IN_PROGRESS"
    })], {
      type: "application/json",
    }));

    if (photo) {
      formData.append("logoFile", photo);
    }

    const response = await axios.post(
      `${API_PROJECT}/${companyId}/project`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyId: companyId
        }
      }
    );

    if (!response.data?.result?.id) {
      throw new Error("Proje oluşturulamadı!");
    }

    const projectId = response.data.result.id;

    // Grup oluşturma
    for (const group of groups) {
      try {
        const groupResponse = await axios.post(
          `${API_GROUP}/${companyId}/group/${projectId}`,
          {
            name: group.name,
            color: group.color || "#000000", // Varsayılan renk
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!groupResponse.data?.result?.id) {
          console.error(`Grup oluşturulamadı: ${group.name}`);
          continue;
        }

        const groupId = groupResponse.data.result.id;

        // Alt grupları oluştur
        for (const subgroup of group.subgroups) {
          try {
            const subGroupResponse = await axios.post(
              `${API_GROUP}/${companyId}/group/${groupId}/subgroup`,
              {
                name: subgroup.name,
                color: group.color || "#000000",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!subGroupResponse.data?.result?.id) {
              console.error(`Alt grup oluşturulamadı: ${subgroup.name}`);
              continue;
            }

            const subGroupId = subGroupResponse.data.result.id;

            // Kullanıcıları ekle
            for (const user of subgroup.users) {
              try {
                await axios.post(
                  `${API_GROUP}/${companyId}/project/${projectId}/user/send?email=${encodeURIComponent(user.email)}`,
                  {
                    userId: user.id,
                    groupId: groupId,
                    subGroupId: subGroupId,
                    role: user.role
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              } catch (error) {
                console.error(`Kullanıcı eklenemedi: ${user.email}`, error);
              }
            }
          } catch (error) {
            console.error(`Alt grup oluşturma hatası: ${subgroup.name}`, error);
          }
        }
      } catch (error) {
        console.error(`Grup oluşturma hatası: ${group.name}`, error);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Proje oluşturma hatası:", error);
    throw error;
  }
};
