import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { postData } from "../../../services/groupServices/PostNewGroup";
import { useEffect } from "react";
import { fetchData } from "../../../services/groupServices/GetCompanyGroups";
import { createSubGroup } from "../../../services/groupServices/CreateNewSubGroup";

const CreateSubGroupModal = ({ groupId, closeModal }) => {
  const [title, setTitle] = useState(""); // Başlık input değeri için state
  
  const selectedCompanyId = Cookies.get("selectedCompanyId");

  const [groups, setGroups] = useState([]);
  const [color, setColor] = useState(""); // Renk seçimi için state

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(selectedCompanyId); // Backend'den veri çekme
        setGroups(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engeller
    try {
      // POST isteği
      const response = await createSubGroup(selectedCompanyId,groupId,title, "2F95F5");
      console.log(response);
      if (response.isSuccess) {
        // Başarı durumu
        alert("Alt grup başarıyla eklendi!");
        closeModal(); // Modal'ı kapat
      } else {
        // Hata durumu
        alert("Alt grup eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">

        <h2 className="text-xl font-light mb-8 text-left">Alt grup oluştur</h2>
        <form className="space-y-8" onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-gray-700 text-left">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-left">Ana grup</label>
            <select
              id="options"
              className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="">None...</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 shadow-sm text-primary text-opacity-75 bg-colorFirst  border border-borderColor rounded-md"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-colorSecond text-primary text-opacity-75 border-borderColor rounded-md mr-2"
            >
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubGroupModal;
