import axios from "axios";
import Cookies from "js-cookie";

const createHelp = async (helpData, photo) => {
  try {
    const formData = new FormData();
    
    // Help request verilerini JSON olarak ekle
    formData.append("helpRequest", new Blob([JSON.stringify(helpData)], {
      type: "application/json"
    }));
    
    // Fotoğrafı ekle
    if (photo) {
      formData.append("photo", photo);
    }

    const response = await axios.post(
      "http://localhost:8085/helps",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createHelp; 