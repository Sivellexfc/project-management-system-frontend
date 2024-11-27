import React from "react";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={"bg-white py-4 shadow-md"}>
      <div className="container mx-auto flex items-center justify-between h-full">
        
          <div></div>
        

        <div className=" flex justify-between w-[320px] py-[20px]">
          
            <div className="hover:underline cursor-pointer">Satıcı Girişi</div>
          
            <div className="hover:underline cursor-pointer">
              Kullanıcı Girişi
            </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
