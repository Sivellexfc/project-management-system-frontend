import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const SelectCompany = () => {
  const accessToken = Cookies.get("accessToken");

  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/v1/company/me/companies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response.data);

        if (response.data.isSuccess) {
          setCompanies(response.data.result || []);
        } else {
          setErrorMessage("Şirketler yüklenirken bir hata oluştu.");
        }
      } catch (error) {
        setErrorMessage("Şirketleri getirirken bir hata meydana geldi.");
        console.error("API Hatası:", error);
      }
    };
    getCompanies();
  }, [accessToken]);

  const handleSelect = async (companyId) => {
    setSelectedId(companyId);
    
    Cookies.set("selectedCompanyId", companyId);
  
    try {
      const response = await axios.get(
        `http://localhost:8085/api/v1/company/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.data.isSuccess) {
        const company = response.data.result;
  
        // Şirket bilgilerini localStorage'a kaydet
        localStorage.setItem(
          "selectedCompany",
          JSON.stringify({
            id: company.id,
            name: company.name,
            logo: company.logo, // Eğer logoyu da kaydetmek istersen
          })
        );
  
        console.log("Seçilen Şirket ID:", company.id);
        console.log("Seçilen Şirket Adı:", company.name);
  
        // Yönlendirme işlemi
        window.location.href = "/dashboard";
      } else {
        setErrorMessage("Şirket bilgileri yüklenirken hata oluştu.");
      }
    } catch (error) {
      setErrorMessage("Şirket bilgilerini çekerken bir hata meydana geldi.");
      console.error("API Hatası:", error);
    }
  };
  
  const handleDirectCreateCompany = () => {
    window.location.href = "/newCompany";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-3 gap-6 p-6 bg-white shadow-lg rounded-xl">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {companies.length > 0 ? (
          companies.map((company) => (
            <div
              key={company.id}
              className={`opacity-70 hover:opacity-100 hover:border-2 hover:border-rose-300 w-32 h-32 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all
                ${
                  selectedId === company.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-white"
                }`}
              onClick={() => handleSelect(company.id)}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="w-24 h-24 object-contain"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">Şirket bulunamadı.</p>
        )}

        <button
          className="opacity-70 hover:opacity-100 hover:border-3 hover:border-rose-300 w-32 h-32 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all"
          onClick={handleDirectCreateCompany}
        >
          <div>Yeni</div>
        </button>
      </div>
    </div>
  );
};

export default SelectCompany;
