import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash, FaUserPlus, FaSearch } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { fetchData } from "../../../services/companyServices/GetCompanyEmployees";
import { postData } from "../../../services/groupServices/PostNewGroup";

// Klon veri
const MOCK_USERS = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com" },
  { id: 2, name: "Mehmet Demir", email: "mehmet@example.com" },
  { id: 3, name: "Ayşe Kaya", email: "ayse@example.com" },
  { id: 4, name: "Fatma Şahin", email: "fatma@example.com" },
  { id: 5, name: "Ali Yıldız", email: "ali@example.com" },
  { id: 6, name: "Zeynep Demir", email: "zeynep@example.com" },
  { id: 7, name: "Can Kaya", email: "can@example.com" },
  { id: 8, name: "Selin Şahin", email: "selin@example.com" },
];

const CreateNewProject = ({ closeModal }) => {

  const [companyUsers, setCompanyUsers] = useState([]);
  // Proje bilgileri
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState(null);
  const selectedCompanyId = Cookies.get("selectedCompanyId");

  // Grup ve altgrup yönetimi
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = companyUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(Cookies.get("selectedCompanyId")); // Backend'den veri çekme

        setCompanyUsers(result.result);
        
        console.log(result.result)
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

      console.log({
        title,
        description,
        endDate: formattedEndDate,
        groups,
        companyId: selectedCompanyId,
      });

      console.log(groups);
      const response = await postData(selectedCompanyId,groupId,title, "2F95F5");
      console.llog(response)
      alert("Proje başarıyla oluşturuldu!");
      closeModal();
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName.trim(),
        users: [],
        subgroups: [],
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
    }
  };

  const handleRemoveGroup = (groupId) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  const handleAddSubgroup = (groupId) => {
    const newSubgroupName = prompt("Alt grup adını giriniz:");
    if (newSubgroupName && newSubgroupName.trim()) {
      setGroups(
        groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              subgroups: [
                ...group.subgroups,
                {
                  id: Date.now(),
                  name: newSubgroupName.trim(),
                  users: [],
                },
              ],
            };
          }
          return group;
        })
      );
    }
  };

  const handleRemoveSubgroup = (groupId, subgroupId) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            subgroups: group.subgroups.filter(
              (subgroup) => subgroup.id !== subgroupId
            ),
          };
        }
        return group;
      })
    );
  };

  const handleAddUserToGroup = (groupId, subgroupId = null) => {
    if (selectedUsers.length > 0) {
      setGroups(
        groups.map((group) => {
          if (group.id === groupId) {
            if (subgroupId) {
              return {
                ...group,
                subgroups: group.subgroups.map((subgroup) => {
                  if (subgroup.id === subgroupId) {
                    return {
                      ...subgroup,
                      users: [...subgroup.users, ...selectedUsers],
                    };
                  }
                  return subgroup;
                }),
              };
            } else {
              return {
                ...group,
                users: [...group.users, ...selectedUsers],
              };
            }
          }
          return group;
        })
      );
      setSelectedUsers([]);
      setShowUserSelect(false);
    }
  };

  const handleRemoveUserFromGroup = (groupId, userId, subgroupId = null) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          if (subgroupId) {
            return {
              ...group,
              subgroups: group.subgroups.map((subgroup) => {
                if (subgroup.id === subgroupId) {
                  return {
                    ...subgroup,
                    users: subgroup.users.filter((user) => user.id !== userId),
                  };
                }
                return subgroup;
              }),
            };
          } else {
            return {
              ...group,
              users: group.users.filter((user) => user.id !== userId),
            };
          }
        }
        return group;
      })
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Yeni Proje Oluştur
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Sol Kolon - Proje Bilgileri */}
          <div className="space-y-6">
            <div>
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

            <div>
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

            <div>
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
          </div>

          {/* Sağ Kolon - Grup ve Altgrup Yönetimi */}
          <div className="space-y-6">
            {/* Yeni Grup Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeni Grup Ekle
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Grup adı"
                  className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="px-4 py-2 bg-colorFirst border border-borderColor text-primary rounded-md hover:bg-blue-600 transition-colors"
                >
                  <BiPlus />
                </button>
              </div>
            </div>

            {/* Gruplar Listesi */}
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{group.name}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroup(group.id);
                          setSelectedSubgroup(null);
                          setShowUserSelect(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaUserPlus />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(group.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Grup Kullanıcıları */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {group.users.map((user) => (
                        <span
                          key={user.id}
                          className="bg-gray-200 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          {user.firstName + " " + user.lastName}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveUserFromGroup(group.id, user.id)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Altgruplar */}
                  <div className="space-y-3">
                    <div className="flex flex-col items-center border border-borderColor px-4 py-2 rounded-lg">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Altgruplar
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSubgroup(group.id)}
                          className="text-green-500 hover:text-green-700 text-sm"
                        >
                          <di className="flex gap-2 items-center justify-between border border-borderColor p-2 rounded-lg">
                            <FaPlus /> <span className="font-light">Ekle</span>
                          </di>
                        </button>
                      </div>
                      <div className="w-full space-y-2">
                      {group.subgroups.map((subgroup) => (
                        <div
                          key={subgroup.id}
                          className="border border-borderColor p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              {subgroup.name}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedGroup(group.id);
                                  setSelectedSubgroup(subgroup.id);
                                  setShowUserSelect(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                <FaUserPlus />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSubgroup(group.id, subgroup.id)
                                }
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {subgroup.users.map((user) => (
                              <span
                                key={user.id}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                              >
                                {user.firstName + " " + user.lastName}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveUserFromGroup(
                                      group.id,
                                      user.id,
                                      subgroup.id
                                    )
                                  }
                                  className="text-green-600 hover:text-green-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>

                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kullanıcı Seçim Modalı */}
          {showUserSelect && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-medium mb-4">Kullanıcı Ekle</h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kullanıcı ara..."
                    className="w-full border border-gray-300 p-2 pl-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.some((u) => u.id === user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((u) => u.id !== user.id)
                            );
                          }
                        }}
                        className="rounded text-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserSelect(false);
                      setSelectedUsers([]);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddUserToGroup(selectedGroup, selectedSubgroup)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Butonları */}
          <div className="col-span-2 flex justify-end gap-2">
          <button
              type="submit"
              className="px-4 py-2 border border-borderColor bg-colorFirst text-primary rounded-md hover:bg-colorSecond transition-colors"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 transition-colors"
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
