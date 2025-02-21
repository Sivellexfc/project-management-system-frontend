import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import CompanyProfile from "./CompanyProfile";
import ProfjectSettings from "./ProfjectSettings";

const CompanySettings = () => {
  const [selectedComponent, setSelectedComponent] = useState("profile");

  console.log("selected : ",selectedComponent)
  const renderComponent = () => {
    switch (selectedComponent) {
      case "profile":
        return <CompanyProfile />;
      case "projects":
        return <ProfjectSettings />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full">
      <Header setSelectedComponent={setSelectedComponent} ></Header>
      <div className="">{renderComponent()}</div>
    </div>
  );
};

export default CompanySettings;
