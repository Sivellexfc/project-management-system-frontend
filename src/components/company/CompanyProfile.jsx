import React, { useEffect, useState } from "react";
import { fetchData } from "../../services/companyServices/GetCompany";

const CompanyProfile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("3"); // "users" endpoint'ini çağır
        console.log("veri tekrar çekildi başarılı : ")
        setData(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl my-5 font-primary font-medium">Profile</h1>
      
      {data ? (
          <div className="flex flex-col border bg-colorFirst border-borderColor md:flex-row gap-6 p-4">
            {/* Profil Fotoğraf Alanı */}
            <div className="flex-shrink-0 w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              {/* Buraya ileride bir img ekleyebilirsin */}
              Fotoğraf
            </div>

            {/* Şirket Bilgileri */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{data.result.name}</h2>
              <p className="text-gray-600">{data.result.description}</p>

              {/* Şirket İletişim Bilgileri */}
              <div className="mt-4">
                <p className="text-gray-700"><strong>Telefon:</strong> {data.result.phoneNumber}</p>
                <p className="text-gray-700"><strong>Email:</strong> {data.result.email || "Belirtilmemiş"}</p>
                <p className="text-gray-700">
                  <strong>Website:</strong>{" "}
                  <a href={data.result.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {data.result.website}
                  </a>
                </p>
              </div>

              {/* Adres Bilgileri */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Adres</h3>
                <p className="text-gray-700">{data.result.address.street}, {data.result.address.city}</p>
                <p className="text-gray-700">{data.result.address.zipCode}, {data.result.address.country}</p>
              </div>

              {/* Abonelik Bilgileri */}
              <div className="mt-4  rounded-lg ">
                <h3 className="text-lg font-semibold text-gray-800">Abonelik Planı</h3>
                <p className="text-gray-700"><strong>Durum:</strong> {data.result.subscriptionPlan.status}</p>
                <p className="text-gray-700"><strong>Açıklama:</strong> {data.result.subscriptionPlan.description}</p>
                <p className="text-gray-700"><strong>Projeler:</strong> {data.result.subscriptionPlan.maxProjects}</p>
                <p className="text-gray-700"><strong>Görevler:</strong> {data.result.subscriptionPlan.maxTasks}</p>
                <p className="text-gray-700"><strong>Kullanıcılar:</strong> {data.result.subscriptionPlan.maxUsers}</p>
                <p className="text-gray-700"><strong>Fiyat:</strong> {data.result.subscriptionPlan.price}₺</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        )}
    </div>
  );
};

export default CompanyProfile;
