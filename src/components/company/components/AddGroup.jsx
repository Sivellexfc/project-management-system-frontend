import React from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { postData } from "../../../services/groupServices/PostNewGroup";


const AddGroup = ({ closeModal }) => {
  const [title, setTitle] = useState(""); // Başlık input değeri için state
  const selectedCompanyId = Cookies.get("selectedCompanyId")

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engeller
    try {
      // POST isteği
      const response = await postData(title,selectedCompanyId);
      console.log(response)
      if (response.isSuccess) {
        // Başarı durumu
        alert("Grup başarıyla eklendi!");
        closeModal(); // Modal'ı kapat
      } else {
        // Hata durumu
        alert("Grup eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Grup Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

export default AddGroup;
