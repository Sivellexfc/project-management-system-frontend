import React from "react";

const Header = () => {
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
          <a href="/projects" className="text-gray-700 hover:text-blue-600">
            Sign Up
          </a>
          <a href="/settings" className="text-gray-700 hover:text-blue-600">
            Login
          </a>
        </nav>

        {/* Kullanıcı Avatarı */}
        <div className="relative">
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
