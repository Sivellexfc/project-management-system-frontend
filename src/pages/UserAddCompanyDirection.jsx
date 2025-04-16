import React, { useEffect } from "react";
import { addUserToCompany } from "../services/companyServices/AddUserToCompany";
import { useLocation, useNavigate } from "react-router-dom";

const UserAddCompanyDirection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get("token");

  useEffect(() => {
    const addUser = async () => {
      if (token) {
        console.log("Key:", token);
        try {
          const result = await addUserToCompany(token);
          console.log("Şirkete ekleme başarılı:", result);
          navigate("/verification");
        } catch (error) {
          console.error("Şirkete ekleme başarısız:", error);
        }
      }
    };
    addUser();
  }, [token]);
  

  return <div className="flex justify-between items-center">Yönlendiriliyorsunuz...</div>;
};

export default UserAddCompanyDirection;
