import React, { Children } from "react";

const CancelButton = ({method}) => {
  return (
    <button
      type="button"
      onClick={method}
      className="px-4 py-2 bg-colorSecond text-primary text-opacity-75 border-borderColor rounded-md mr-2"
    >
      İptal
    </button>
  );
};

export default CancelButton;
