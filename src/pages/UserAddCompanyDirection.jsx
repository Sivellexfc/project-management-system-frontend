import React, { useEffect } from "react";
import { addUserToCompany } from "../services/companyServices/AddUserToCompany";
import { useLocation } from "react-router-dom";

const UserAddCompanyDirection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get("token");

  useEffect(() => {
    const addUser = async () => {
      if (token) {
        console.log("Key:", token);
        try {
          const result = await addUserToCompany(token);
          console.log("Şirkete ekleme başarılı:", result);
        } catch (error) {
          console.error("Şirkete ekleme başarısız:", error);
        }
      }
    };
    addUser();
  }, [token]);
  

  return <div>Yönlendiriliyorsunuz</div>;
};

export default UserAddCompanyDirection;
