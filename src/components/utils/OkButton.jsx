import React from "react";

const OkButton = ({type,method}) => {
  return (
    <button
      type={type}
      onClick={method}
      className="px-4 py-2 shadow-sm text-primary text-opacity-75 bg-colorFirst  border border-borderColor rounded-md"
    >
      Kaydet
    </button>
  );
};

export default OkButton;
