import React from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  //const user = useSelector((state) => state.auth.user);
  //console.log("user : "+ user)
  const accessToken = Cookies.get("accessToken");

  console.log("token :" + JSON.stringify(accessToken, null, 2));
  const user = jwtDecode(accessToken);

  const handleLogout = () => {
    Cookies.remove("accessToken");

    navigate("/home");
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Sol kısım: Logo veya Proje Adı */}
      <div className="flex items-center">
        <div className="text-l font-bold text-gray-800">Manager</div>
      </div>

      {/* Sağ kısım: Menü ve Kullanıcı Bilgisi */}
      <div className="flex items-center space-x-6">
        {/* Menü */}
        <nav className="hidden md:flex space-x-4">
          <a href="/sign-up" className="text-gray-700 hover:text-blue-600">
            {user.userFirstName + " " + user.userLastName}
          </a>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-600"
          >
            Çıkış Yap
          </button>
        </nav>

        {/* Kullanıcı Avatarı */}
        <div className="relative">
          <div>
            <p></p>
          </div>
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
