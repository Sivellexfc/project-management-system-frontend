import React, { useState } from "react";
import { inviteUserToCompany } from "../../../services/companyServices/InviteEmployeeToCompany";
import Cookies from "js-cookie";


const InviteUser = ({ closeModal }) => {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const selectedCompanyId = Cookies.get("selectedCompanyId")
        console.log("selected ",selectedCompanyId)
        const response = await inviteUserToCompany(email,selectedCompanyId);

        console.log(response)
        if (response.isSuccess) {
          // Başarı durumu
          alert("Davet bağlantısı başarıyla gönderildi!");
          closeModal(); // Modal'ı kapat
        } else {
          // Hata durumu
          alert("Davet bağlantısı gönderilirken bir sorunlar karşılaşıldı");
        }
      } catch (error) {
        console.error("Hata:", error);
        alert(`Hata oluştu: ${error.response?.data?.message || error.message}`);
      }
    };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Yeni Üye Formu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Ad</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">E-posta</label>
            <input
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-colorFirst text-primary border border-borderColor rounded-md"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-colorSecond text-primary border-borderColor rounded-md mr-2"
            >
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
