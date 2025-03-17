import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { postData } from "../../../services/groupServices/PostNewGroup";
import { useEffect } from "react";
import { createSubGroup } from "../../../services/groupServices/CreateNewSubGroup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchData } from "../../../services/groupServices/GetCompanyGroups";
import { createProject } from "../../../services/projectServices/CreateProject";

const CreateNewProject = ({ closeModal }) => {
  const [title, setTitle] = useState(""); // Başlık input değeri için state
  const [description, setDescription] = useState("");
  const selectedCompanyId = Cookies.get("selectedCompanyId");
  const [groups, setGroups] = useState([]);
  const [endDate, setEndDate] = useState(null); // Bitiş tarihi için state
  const [color, setColor] = useState(""); // Renk seçimi için state

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedGroupsIDs, setSelectedGroupsIDs] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedGroups.some((g) => g.id === group.id)
  );

  const addGroup = (group) => {
    setSelectedGroups([...selectedGroups, group]);
    setSearch(""); // Input'u temizle
    setShowDropdown(false); // Listeyi kapat
  };

  const removeGroup = (id) => {
    setSelectedGroups(selectedGroups.filter((group) => group.id !== id));
  };

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
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    try {
      // POST isteği
      const response = await createProject(title,description,formattedEndDate,selectedGroups.map(group => group.id),selectedCompanyId);
      console.log(response);
      if (response.isSuccess) {
        // Başarı durumu
        alert("Proje başarıyla eklendi!");
        closeModal(); // Modal'ı kapat
      } else {
        // Hata durumu
        alert("Proje eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl font-light mb-8 text-left">
          Yeni proje oluştur
        </h2>
        <form className="space-y-8 relative" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-left">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-left">Açıklama</label>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="relative">

            {/* Seçili Gruplar */}
            <div className="flex flex-wrap gap-2 text-sm font-light text-primary py-2">
              {selectedGroups.map((group) => (
                <span
                  key={group.id}
                  className="shadow-sm text-primary text-opacity-75 bg-colorFirst  border border-borderColor rounded-md px-2 py-1 flex items-center"
                >
                  {group.name}
                  <button
                    onClick={() => removeGroup(group.id)}
                    className="ml-2 text-borderColor hover:text-red-500"
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
            {/* Input Alanı */}
            <label className="block text-gray-700 text-left" >Grup ekle</label>
            <input
              type="text"
              className="w-full text-sm px-4 py-2 border font-light border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Grup ekle..."
            />

            

            {/* Dropdown Listesi */}
            {showDropdown && filteredGroups.length > 0 && (
              <ul className="absolute left-0 top-full w-full bg-white border shadow-md mt-1 rounded z-70">
                {filteredGroups.map((group) => (
                  <li
                    key={group.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addGroup(group)}
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bitiş Tarihi Seçici */}
          <div className="mb-4 z-40">
            <label className="block text-gray-700 text-left">Bitiş Tarihi</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()} // Geçmiş tarihler seçilemez
              className="w-full text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholderText="Bitiş tarihi seçin..."
            />
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

export default CreateNewProject;
