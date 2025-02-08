import React from "react";
import { Outlet } from "react-router-dom"; // Dinamik içerik için
import Sidebar from "./Sidebar"; // Sidebar bileşeni
import Header from "./Header";   // Header bileşeni


/**
 * 
 * Ana sayfa düzeni Layout ile sağlanır ve Outlet dinamik olarak seçilen component ile doldurulur. 
 */
const Layout = () => {
  return (
    <div className="flex h-screen bg-[#FBFBFB]">
      {/* Sidebar */}
      <Sidebar />
      {/* Sağdaki ana içerik alanı */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        
        {/* Dinamik içerik alanı (Outlet) */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
