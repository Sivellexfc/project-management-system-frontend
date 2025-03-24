import React, { useEffect, useState } from "react";
import { fetchData } from "../../services/companyServices/GetCompany";
import { FaBuilding, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

const CompanyProfile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("3");
        console.log("veri tekrar çekildi başarılı : ")
        setData(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="w-full">
      {data ? (
        <div className="w-full">
          {/* Ana Profil Kartı */}
          <div className="bg-white rounded-lg overflow-hidden border border-borderColor">
            {/* Üst Banner */}
            <div className="h-32 bg-gradient-to-r from-colorFirst to-blue-600 relative">
              {/* Logo Alanı */}
              <div className="absolute -bottom-16 left-6">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <FaBuilding className="w-16 h-16 text-colorFirst" />
                </div>
              </div>
            </div>
            
            {/* Profil İçeriği */}
            <div className="pt-20 px-4 pb-4">
              {/* Şirket Bilgileri */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.result.name}</h2>
                <p className="text-gray-600 text-lg mb-6">{data.result.description}</p>

                {/* İletişim Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">İletişim Bilgileri</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-colorFirst" />
                        <span className="text-gray-700">{data.result.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-colorFirst" />
                        <span className="text-gray-700">{data.result.email || "Belirtilmemiş"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaGlobe className="text-colorFirst" />
                        <a href={data.result.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline">
                          {data.result.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Adres Bilgileri */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Adres</h3>
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-colorFirst mt-1" />
                      <div>
                        <p className="text-gray-700">{data.result.address.street}, {data.result.address.city}</p>
                        <p className="text-gray-700">{data.result.address.zipCode}, {data.result.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abonelik Bilgileri */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCreditCard className="text-colorFirst text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">Abonelik Planı</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Durum</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.status}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Açıklama</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.description}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Projeler</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.maxProjects}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Görevler</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.maxTasks}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Kullanıcılar</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.maxUsers}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Fiyat</p>
                      <p className="font-medium text-gray-800">{data.result.subscriptionPlan.price}₺</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-colorFirst"></div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
