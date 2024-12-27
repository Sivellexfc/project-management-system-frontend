import React from "react";

export const Logout = () => {
  Cookies.remove("accessToken");

  return <div>Logout</div>;
};
