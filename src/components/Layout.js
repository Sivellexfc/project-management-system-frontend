import React from "react";
import { Outlet } from "react-router-dom"; // Dinamik içerik için
import Sidebar from "./Sidebar"; // Sidebar bileşeni
import Header from "./Header";   // Header bileşeni

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Sağdaki ana içerik alanı */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dinamik içerik alanı (Outlet) */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
