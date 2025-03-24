import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchData } from "../../../services/groupServices/GetCompanyGroups";
import { createProject } from "../../../services/projectServices/CreateProject";

const CreateNewProject = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const selectedCompanyId = Cookies.get("selectedCompanyId");
  const [groups, setGroups] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedGroups.some((g) => g.id === group.id)
  );

  const addGroup = (group) => {
    setSelectedGroups([...selectedGroups, group]);
    setSearch("");
    setShowDropdown(false);
  };

  const removeGroup = (id) => {
    setSelectedGroups(selectedGroups.filter((group) => group.id !== id));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(selectedCompanyId);
        setGroups(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Lütfen bir başlık giriniz.");
      return;
    }
    if (!endDate) {
      alert("Lütfen bir bitiş tarihi seçiniz.");
      return;
    }
    
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    try {
      const response = await createProject(
        title,
        description,
        formattedEndDate,
        selectedGroups.map(group => group.id),
        selectedCompanyId
      );
      console.log(response);
      if (response.isSuccess) {
        alert("Proje başarıyla eklendi!");
        closeModal();
      } else {
        alert("Proje eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Yeni Proje Oluştur</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Başlık */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proje başlığı"
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Açıklama */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proje açıklaması"
              className="w-full border border-gray-300 p-2 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Gruplar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gruplar
            </label>
            
            {/* Seçili Gruplar */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedGroups.map((group) => (
                <span
                  key={group.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {group.name}
                  <button
                    type="button"
                    onClick={() => removeGroup(group.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Grup Arama */}
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Grup ara..."
              />

              {/* Dropdown */}
              {showDropdown && filteredGroups.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {filteredGroups.map((group) => (
                    <li
                      key={group.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => addGroup(group)}
                    >
                      {group.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Bitiş Tarihi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholderText="Bitiş tarihi seçin"
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewProject;
