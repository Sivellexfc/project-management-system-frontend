import React, { useState } from "react";
import CancelButton from "../utils/CancelButton";
import OkButton from "../utils/OkButton";

interface Props {
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

const TaskModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (title.trim() === "") return;
    onSave(title, description);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Yeni Görev Ekle</h2>
        <input
          type="text"
          placeholder="Başlık"
          className="w-full border p-2 rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Açıklama"
          className="w-full border p-2 rounded mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 shadow-sm text-primary text-opacity-75 bg-colorFirst  border border-borderColor rounded-md"
            onClick={handleSubmit}
          >
            Kaydet
          </button>
          <button
            className="px-4 py-2 bg-colorSecond text-primary text-opacity-75 border-borderColor rounded-md mr-2"
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
