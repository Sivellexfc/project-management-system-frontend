import React from "react";
import UserCard from "./components/UserCard";
import { fetchData } from "../../services/companyServices/GetCompanyEmployees";

const CompanyUsersListCard = () => {
  
  const data = {
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    isim: "Musluhan Çavuş",
    email: "musluhan01@hotmail.com",
    band: "Developer",
    subBand: "Frontend Developer",
    lastLogin: "09-10-2025 10.01PM",
  };

  return (
    <div className="flex flex-col bg-colorFirst rounded-md mt-5 space-y-4 p-4 border border-borderColor">
      <UserCard
        name={data.isim}
        email={data.email}
        avatar={data.avatar}
        band={data.band}
        subBand={data.subBand}
        lastLogin={data.lastLogin}
      ></UserCard>
      <UserCard
        name={data.isim}
        email={data.email}
        avatar={data.avatar}
        band={data.band}
        subBand={data.subBand}
        lastLogin={data.lastLogin}
      ></UserCard>
    </div>
  );
};

export default CompanyUsersListCard;
