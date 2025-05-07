import React, { useState } from "react";
import { inviteUserToCompany } from "../../../services/companyServices/InviteEmployeeToCompany";
import Cookies from "js-cookie";
import { MdWarning } from "react-icons/md";
import { RemoveUserFromCompany } from "../../../services/companyServices/RemoveUser";
import { FaTimes } from "react-icons/fa";

const RemoveUser = ({ closeRemoveMemberModal, userId }) => {
  const handleRemove = async (e) => {
    try {
      const selectedCompanyId = Cookies.get("selectedCompanyId");
      
      console.log("userId : " + userId);
      console.log("selectedCompanyId : " + selectedCompanyId);

      const response = await RemoveUserFromCompany(userId, selectedCompanyId);

      console.log(response);
      if (response.isSuccess) {
        alert("Kullanıcı başarıyla şirketten çıkartıldı.");
        closeRemoveMemberModal();
      } else {
        alert("Kullanıcı çıkartılırken bir sorunla karşılaşıldı");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert(`Hata oluştu: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Kullanıcıyı şirketten çıkart</h2>
          <button
            onClick={closeRemoveMemberModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center gap-4">
            <MdWarning size={32} className="text-red-500" />
            <p className="text-red-700 font-medium">
              Bu kullanıcıyı şirketten çıkartmak istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeRemoveMemberModal}
            className="px-4 py-2 rounded-lg font-light border border-borderColor text-gray-700 hover:bg-gray-100 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleRemove}
            className="px-4 py-2 rounded-lg font-light bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Çıkart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveUser;
