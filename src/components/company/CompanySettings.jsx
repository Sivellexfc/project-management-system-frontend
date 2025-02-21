import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import CompanyProfile from "./CompanyProfile";
import ProfjectSettings from "./ProjectSettings";
import CompanyEmployees from "./CompanyEmployees";
import GroupsPage from "./GroupsPage";
import SubGroupsPage from "./SubGroupsPage";

const CompanySettings = () => {
  const [selectedComponent, setSelectedComponent] = useState("profile");

  console.log("selected : ",selectedComponent)
  const renderComponent = () => {
    switch (selectedComponent) {

      case "profile":
        return <CompanyProfile />;

      case "projects":
        return <ProfjectSettings />;

      case "groups":
        return <GroupsPage />;

      case "subgroups":
        return <SubGroupsPage />;

      case "employees":
        return <CompanyEmployees />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full flex flex-col">
      <h1 className="font-primary text-3xl font-medium pb-10">Şirket ayarları</h1>
      <Header setSelectedComponent={setSelectedComponent} ></Header>
      <div className="">{renderComponent()}</div>
    </div>
  );
};

export default CompanySettings;
