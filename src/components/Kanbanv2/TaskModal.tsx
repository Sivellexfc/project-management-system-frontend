import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFlag } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { MdLowPriority } from "react-icons/md";
import Cookies from "js-cookie";
import { createIssue } from "../../services/issueServices/CreateNewIssue";
import { useParams } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const STAGES = [
  { id: 1, name: "TODO" },
  { id: 2, name: "IN PROGRESS" },
  { id: 3, name: "IN REVIEW" },
  { id: 4, name: "DONE" }
];

const LABELS = [
  { id: 1, name: "Acil", color: "red" },
  { id: 2, name: "Hata Düzeltme", color: "orange" },
  { id: 3, name: "Geliştirme", color: "blue" },
  { id: 4, name: "İyileştirme", color: "green" }
];

const TaskModal: React.FC<Props> = ({ onClose }) => {
  const { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(2);
  const [selectedLabel, setSelectedLabel] = useState<number>(1); // Default olarak ilk label seçili
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [stage, setStage] = useState(STAGES[0].id); // Default olarak TODO seçili

  const handleAddGroup = () => {
    if (group.trim() && !groups.includes(group.trim())) {
      setGroups([...groups, group.trim()]);
      setGroup("");
    }
  };

  const handleRemoveGroup = (groupToRemove: string) => {
    setGroups(groups.filter((g) => g !== groupToRemove));
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

    try {
      const response = await createIssue(
        selectedCompanyId,
        title,
        description,
        startDate.toISOString(),
        endDate.toISOString(),
        stage,
        projectId,
        priority,
        selectedLabel // Seçili label ID'sini gönderiyoruz
      );
      console.log(response);
    
      if (response.isSuccess) {
        alert("Görev başarıyla oluşturuldu!");
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
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Yeni Görev Ekle</h2>
        
        {/* Başlık */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
          <input
            type="text"
            placeholder="Görev başlığı"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Açıklama */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea
            placeholder="Görev açıklaması"
            className="w-full border border-gray-300 p-2 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Stage Seçimi */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
          <select
            value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tarihler */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dateFormat="dd/MM/yyyy"
              placeholderText="Başlangıç tarihi seçin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dateFormat="dd/MM/yyyy"
              placeholderText="Bitiş tarihi seçin"
              minDate={startDate || undefined}
            />
          </div>
        </div>

        {/* Öncelik */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPriority(1)}
              className={`flex items-center justify-center p-3 rounded-md ${
                priority === 1
                  ? "bg-green-100 text-green-600 border-2 border-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <MdLowPriority size={24} />
            </button>
            <button
              type="button"
              onClick={() => setPriority(2)}
              className={`flex items-center justify-center p-3 rounded-md ${
                priority === 2
                  ? "bg-yellow-100 text-yellow-600 border-2 border-yellow-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaFlag size={24} />
            </button>
            <button
              type="button"
              onClick={() => setPriority(3)}
              className={`flex items-center justify-center p-3 rounded-md ${
                priority === 3
                  ? "bg-red-100 text-red-600 border-2 border-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <IoMdAlert size={24} />
            </button>
          </div>
        </div>

        {/* Etiketler */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Etiket Seç</label>
          <div className="flex gap-2 flex-wrap">
            {LABELS.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => setSelectedLabel(label.id)}
                className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${
                  selectedLabel === label.id
                    ? `bg-${label.color}-100 text-${label.color}-800 border-2 border-${label.color}-500`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gruplar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Grupları</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Yeni grup"
              className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddGroup()}
            />
            <button
              type="button"
              onClick={handleAddGroup}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <span
                key={group}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {group}
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(group)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
