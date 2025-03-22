import React from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { postData } from "../../../services/groupServices/PostNewGroup";
import { FaTimes, FaSearch, FaUserPlus, FaUserMinus } from "react-icons/fa";

const COLORS = [
  { id: 1, name: "Açık Mavi", value: "#7EC8E3" },
  { id: 2, name: "Açık Yeşil", value: "#A8E6A1" },
  { id: 3, name: "Açık Turuncu", value: "#FFB966" },
  { id: 4, name: "Açık Kırmızı", value: "#FF7F7F" },
  { id: 5, name: "Açık Mor", value: "#D8A7FF" },
  { id: 6, name: "Açık Pembe", value: "#FFB3D9" },
  { id: 7, name: "Açık Sarı", value: "#FFF4B3" },
  { id: 8, name: "Açık Lila", value: "#D1A3FF" },
  { id: 9, name: "Açık Gri", value: "#D3D3D3" },
  { id: 10, name: "Açık Turkuaz", value: "#A4D8D2" },
  { id: 11, name: "Açık Mint Yeşili", value: "#B4E2B7" },
  { id: 12, name: "Açık Mavi-Gri", value: "#C7D8E8" },
];

// Örnek kullanıcı verileri
const MOCK_USERS = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com" },
  { id: 2, name: "Ayşe Demir", email: "ayse@example.com" },
  { id: 3, name: "Mehmet Kaya", email: "mehmet@example.com" },
  { id: 4, name: "Zeynep Şahin", email: "zeynep@example.com" },
  { id: 5, name: "Can Öztürk", email: "can@example.com" },
];

const AddGroup = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const selectedCompanyId = Cookies.get("selectedCompanyId");

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setShowUserList(false);
    setSearchQuery("");
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData(title, selectedCompanyId);
      console.log(response);
      if (response.isSuccess) {
        alert("Grup başarıyla eklendi!");
        closeModal();
      } else {
        alert("Grup eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[500px] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Yeni Grup Oluştur</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grup Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grup Adı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Grup adını girin"
              />
            </div>

            {/* Renk Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grup Rengi
              </label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor.id === color.id
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Kullanıcı Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grup Üyeleri
              </label>
              
              {/* Kullanıcı Arama */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowUserList(true)}
                    className="w-full outline-none"
                    placeholder="Kullanıcı ara..."
                  />
                </div>

                {/* Kullanıcı Listesi */}
                {showUserList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seçili Kullanıcılar */}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => handleUserRemove(user.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaUserMinus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-colorSecond text-primary border border-borderColor rounded-md hover:bg-gray-100 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-colorFirst text-primary border border-borderColor rounded-md hover:bg-blue-50 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
