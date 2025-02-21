import React from "react";

export const Logout = () => {
  Cookies.remove("accessToken");
  localStorage.removeItem("selectedCompany");

  return <div>Logout</div>;
};
