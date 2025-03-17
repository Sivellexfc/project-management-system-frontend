import { useEffect, useState } from "react";
import React from "react";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import { useSearchParams } from "react-router-dom";

const SelectAccountType = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token")?.trim(); // URL'den token al
    if (tokenParam) {
      setShowLogin(true);
    }
  }, [searchParams]);

  const accountTypes = [
    {
      id: "USER",
      label: "Kişisel Hesap",
      content:
        "Kişisel hesap, bireysel kullanıcılar için tasarlanmıştır. Kendi projelerinizi yönetebilir, takip edebilir ve platformun sunduğu özelliklerden kişisel kullanım için faydalanabilirsiniz.",
    },
    {
      id: "COMPANY_OWNER",
      label: "Kurumsal Hesap",
      content:
        "Kurumsal hesap, şirketler ve ekipler için idealdir. Çalışanlarınızı ekleyebilir, projeleri yönetebilir ve iş süreçlerinizi daha verimli hale getirmek için gelişmiş araçlara erişebilirsiniz.",
    },
    {
      id: "ADMIN",
      label: "Admin",
      content:
        "Admin hesabı, tüm sistem üzerinde tam yetkiye sahip kullanıcılar içindir. Kullanıcı yönetimi, sistem ayarları ve güvenlik politikalarını düzenleme gibi yetkilere sahiptir.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-colorSecond space-y-10">
      {!showLogin ? (
        <>
          <h2 className="text-2xl font-md mb-6">Select Account Type</h2>

          <div className="flex gap-6">
            {accountTypes.map((type) => (
              <div
                key={type.id}
                className={`cursor-pointer p-6 w-64 flex flex-col items-center justify-between border-2 rounded-lg text-md font-light transition-all duration-300 ${
                  selectedType === type.id
                    ? "border-sky-600 shadow-lg bg-colorFirst"
                    : "border-borderColor border-1 bg-colorFirst "
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="w-full flex flex-col items-center mb-4">
                  <div className="text-lg text-center">{type.label}</div>
                  <hr className="border-1 w-full" />
                </div>
                <div className="font-light text-sm text-center">
                  {type.content}
                </div>
              </div>
            ))}
          </div>

          <button
            className={`mt-6 px-6 py-2 text-white font-light rounded-md transition-all duration-300 ${
              selectedType
                ? "bg-sky-500 hover:bg-sky-600"
                : "bg-gray-400 opacity-50 cursor-not-allowed"
            }`}
            disabled={!selectedType}
            onClick={() => setShowLogin(true)}
          >
            Proceed
          </button>
        </>
      ) : (
        <div className="transition-opacity duration-500 opacity-100 w-full">
          <Register type={selectedType} />
        </div>
      )}
    </div>
  );
};

export default SelectAccountType;
