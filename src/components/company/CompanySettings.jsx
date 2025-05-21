import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import CompanyProfile from "./CompanyProfile";
import ProfjectSettings from "./ProjectSettings";
import CompanyEmployees from "./CompanyEmployees";
import GroupsPage from "./GroupsPage";
import SubGroupsPage from "./SubGroupsPage";
import CompanyUsersListCard from "./CompanyUsersListCard";

const CompanySettings = () => {
  const [selectedComponent, setSelectedComponent] = useState("profile");
  const options = {
    profile:"Profil",
    projects:"Projeler",
    groups:"Gruplar",
    subgroups:"Alt Gruplar",
    employees:"Üyeler"
  }
  
  const renderComponent = () => {
    switch (selectedComponent) {

      case "profile":
        return <CompanyProfile />;

      case "projects":
        return <ProfjectSettings />;

      case "employees":
        return <CompanyEmployees />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      <div>
      <h1 className="font-primary text-3xl font-semibold">Şirket ayarları</h1>
      <h1 className="font-primary text-2xl font-light">{"- "+ options[selectedComponent]}</h1>
      </div>
      {/* <h2 className="font-md text-xl pb-10">{selectedComponent}</h2> */}
      <Header setSelectedComponent={setSelectedComponent} ></Header>
      <div className="">{renderComponent()}</div>
    </div>
  );
};

export default CompanySettings;
