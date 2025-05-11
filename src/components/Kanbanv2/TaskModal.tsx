import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCross, FaFlag, FaPlus, FaTrash, FaXbox, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { MdLowPriority, MdPriorityHigh } from "react-icons/md";
import Cookies from "js-cookie";
import { createIssue } from "../../services/issueServices/CreateNewIssue";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineWarning } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import LABELS from "../utils/Labels";

interface Props {
  onClose: () => void;
}

interface Group {
  id: number;
  name: string;
}

interface SubGroup {
  id: number;
  name: string;
}

const STAGES = [
  { id: 1, name: "TODO" },
  { id: 2, name: "IN PROGRESS" },
  { id: 3, name: "IN REVIEW" },
  { id: 4, name: "DONE" }
];



const TaskModal: React.FC<Props> = ({ onClose }) => {
  const { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(2);
  const [selectedLabel, setSelectedLabel] = useState<number>(1);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<SubGroup | null>(null);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [availableSubGroups, setAvailableSubGroups] = useState<SubGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(STAGES[0].id);
  const [steps, setSteps] = useState<{ id: number; description: string }[]>([]);
  const [newStep, setNewStep] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubGroupDropdownOpen, setIsSubGroupDropdownOpen] = useState(false);
  const [isSubGroupsLoading, setIsSubGroupsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subGroupDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const selectedCompanyId = Cookies.get("selectedCompanyId");
        const response = await axios.get(
          `http://localhost:8085/api/v1/company/${selectedCompanyId}/group/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setAvailableGroups(response.data.result || []);
      } catch (error) {
        console.error("Grup verileri çekilirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [projectId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (subGroupDropdownRef.current && !subGroupDropdownRef.current.contains(event.target as Node)) {
        setIsSubGroupDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredGroups = availableGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupSelect = async (group: Group) => {
    setSelectedGroup(group);
    setSelectedSubGroup(null);
    setIsDropdownOpen(false);
    setIsSubGroupsLoading(true);

    try {
      const selectedCompanyId = Cookies.get("selectedCompanyId");
      const response = await axios.get(
        `http://localhost:8085/api/v1/company/${selectedCompanyId}/group/${group.id}/subgroup`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setAvailableSubGroups(response.data.result || []);
    } catch (error) {
      console.error("Alt grup verileri çekilirken hata oluştu:", error);
      setAvailableSubGroups([]);
    } finally {
      setIsSubGroupsLoading(false);
    }
  };

  const handleSubGroupSelect = (subGroup: SubGroup) => {
    setSelectedSubGroup(subGroup);
    setIsSubGroupDropdownOpen(false);
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { id: Date.now(), description: newStep.trim() }]);
      setNewStep("");
    }
  };

  const handleRemoveStep = (stepId: number) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  async function handleSubmit() {
    if (title.trim() === "") {
      alert("Lütfen bir başlık giriniz.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Lütfen başlangıç ve bitiş tarihlerini giriniz.");
      return;
    }

    const selectedCompanyId = Cookies.get("selectedCompanyId");
    if (!selectedCompanyId) {
      alert("Şirket bilgisi bulunamadı!");
      return;
    }

    console.log("selectedGroup : ",selectedGroup)
    console.log("selectedSubGroup : ",selectedSubGroup)


    try {
      // Önce task'i oluştur
      const response = await createIssue(
        selectedCompanyId,
        title,
        description,
        startDate.toISOString(),
        endDate.toISOString(),
        selectedGroup?.id || 0,
        selectedSubGroup?.id || 0,
        stage,
        projectId,
        priority,
        selectedLabel
      );
      console.log(response)

      if (response.isSuccess) {
        // Task başarıyla oluşturulduysa, stepleri ekle
        const taskId = response.result;
        const accessToken = Cookies.get('accessToken');

        // Her bir step için ayrı POST isteği gönder
        for (const step of steps) {
          await axios.post(
            `http://localhost:8085/api/v1/issues/${taskId}/steps`,
            {
              description: step.description,
              isDone: false
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
        }

        alert("Görev ve adımları başarıyla oluşturuldu!");
        onClose();
      } else {
        alert("Görev oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Yeni Görev Ekle</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Sol Kolon */}
          <div className="space-y-6">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input
                type="text"
                placeholder="Görev başlığı"
                className="w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea
                placeholder="Görev açıklaması"
                className="w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Stage Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                value={stage}
                onChange={(e) => setStage(Number(e.target.value))}
                className="w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tarihler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                className="w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                dateFormat="dd/MM/yyyy"
                placeholderText="Başlangıç tarihi seçin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                dateFormat="dd/MM/yyyy"
                placeholderText="Bitiş tarihi seçin"
                minDate={startDate || undefined}
              />
            </div>

            {/* Öncelik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPriority(1)}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    priority === 1
                      ? "bg-green-100 text-green-600 border-1 border-green-600"
                      : "bg-borderColor text-primary"
                  }`}
                >
                  <BsInfoCircle    size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(2)}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    priority === 2
                      ? "bg-yellow-100 text-yellow-600 border-1 border-yellow-600"
                      : "bg-borderColor text-primary"
                  }`}
                >
                  <AiOutlineWarning size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(3)}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    priority === 3
                      ? "bg-orange-100 text-orange-400 border-1 border-orange-400"
                      : "bg-borderColor text-primary"
                  }`}
                >
                  <FaExclamationTriangle  size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(4)}
                  className={`flex items-center justify-center p-3 rounded-md ${
                    priority === 4
                      ? "bg-red-100 text-red-600 border-1 border-red-600"
                      : "bg-borderColor text-primary"
                  }`}
                >
                  <MdPriorityHigh size={24} />
                </button>
              </div>
            </div>

            {/* Etiketler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiket Seç</label>
              <div className="flex gap-2 flex-wrap">
                {LABELS.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => setSelectedLabel(label.id)}
                    className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${
                      selectedLabel === label.id
                        ? `bg-${label.color}-100 text-${label.color}-800  border-${label.color}-500`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="space-y-6">
            {/* Gruplar */}
            <div ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Grubu</label>
              <div className="relative mb-2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Grup ara..."
                  className="w-full pl-10 pr-4 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      </div>
                    ) : filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <div
                          key={group.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleGroupSelect(group)}
                        >
                          <span className="text-gray-700">{group.name}</span>
                          <FaPlus className="text-gray-400 hover:text-gray-600" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        {searchQuery ? "Sonuç bulunamadı" : "Grup bulunamadı"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Seçilen Grup */}
              {selectedGroup && (
                <div className="mt-2">
                  <div className="flex items-center justify-between bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    <span>{selectedGroup.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGroup(null);
                        setSelectedSubGroup(null);
                        setAvailableSubGroups([]);
                      }}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Alt Gruplar */}
              {selectedGroup && (
                <div ref={subGroupDropdownRef} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Grup</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Alt grup seç..."
                      className="w-full pl-3 pr-4 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={() => setIsSubGroupDropdownOpen(true)}
                      value={selectedSubGroup?.name || ""}
                      readOnly
                    />
                    {isSubGroupDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isSubGroupsLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                          </div>
                        ) : availableSubGroups.length > 0 ? (
                          availableSubGroups.map((subGroup) => (
                            <div
                              key={subGroup.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSubGroupSelect(subGroup)}
                            >
                              <span className="text-gray-700">{subGroup.name}</span>
                              <FaPlus className="text-gray-400 hover:text-gray-600" />
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Alt grup bulunamadı
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stepler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adımlar</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Yeni adım ekle"
                  className="flex-1 w-full text-md border p-2 focus:border-gray-200 border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddStep()}
                />
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-colorFirst border border-borderColor text-primary rounded-lg hover:bg-colorSecond transition-colors flex items-center gap-2"
                >
                  <FaPlus size={16} />
                  Ekle
                </button>
              </div>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-borderColor"
                  >
                    <span className="flex-1">{step.description}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(step.id)}
                      className="pr-2 text-red-300 hover:text-red-700"
                    >
                      <RxCross1 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-colorFirst border border-borderColor text-primary rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleSubmit}
          >
            Kaydet
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
