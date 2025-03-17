import React, { useState } from "react";
import { inviteUserToCompany } from "../../../services/companyServices/InviteEmployeeToCompany";
import Cookies from "js-cookie";
import { MdWarning } from "react-icons/md";
import { RemoveUserFromCompany } from "../../../services/companyServices/RemoveUser";

const RemoveUser = ({ closeRemoveMemberModal,userId }) => {

  const handleRemove = async (e) => {
      
      try {
        const selectedCompanyId = Cookies.get("selectedCompanyId")
        
        console.log("userId : "+userId);
        console.log("selectedCompanyId : "+selectedCompanyId);

        const response = await RemoveUserFromCompany(userId,selectedCompanyId);

        console.log(response)
        if (response.isSuccess) {
          // Başarı durumu
          alert("Kullanıcı başarıyla şirketten çıkartıldı.");
          closeRemoveMemberModal(); // Modal'ı kapat
        } else {
          // Hata durumu
          alert("Kullanıcı çıkartılırken bir sorunla karşılaşıldı");
        }
      } catch (error) {
        console.error("Hata:", error);
        alert(`Hata oluştu: ${error.response?.data?.message || error.message}`);
      }
    };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl font-medium mb-4">Kullanıcıyı çıkart</h2>
        <div className="p-4 w-full gap-4 bg-red-400 bg-opacity-25 border border-red-600 text-red-700 flex items-center justify-between">
          <MdWarning size={40} color="red"></MdWarning>
          <span className="text-sm font-semibold">Bu kullanıcıyı şirketten çıkartmak istediğinize emin misiniz? Bu işlem geri alınamaz.</span>
        </div>
        <div></div>
        <div>
          <button onClick={() => {handleRemove()}} className="py-2 px-4 rounded-sm bg-red-300 text-white">Çıkart</button>
          <button onClick={closeRemoveMemberModal} className="py-2 px-4 rounded-sm bg-gray-100 text-primary">İptal</button>
        </div>
      </div>
    </div>
  );
};

export default RemoveUser;
