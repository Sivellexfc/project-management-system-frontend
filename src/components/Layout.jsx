import React from "react";
import { Outlet } from "react-router-dom"; // Dinamik içerik için
import Header from "./Header"; // Header bileşeni
import { AuthProvider } from "../Context/AuthContext";
import SidebarNew from "./SidebarNew";

/**
 *
 * Ana sayfa düzeni Layout ile sağlanır ve Outlet dinamik olarak seçilen component ile doldurulur.
 */
const Layout = () => {
  return (
    <div className="flex h-screen bg-[#FBFBFB]">
      {/* Sidebar */}
      <AuthProvider>
        <SidebarNew />
      </AuthProvider>

      {/* Sağdaki ana içerik alanı */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

        {/* Dinamik içerik alanı (Outlet) */}
        <main className="flex-1 p-10 flex place-items-stretch justify-center overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
