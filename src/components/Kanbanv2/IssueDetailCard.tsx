import React from 'react';
import { Task } from './types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaFlag, FaTimes } from 'react-icons/fa';

interface Props {
  task: Task;
  onClose: () => void;
}

const PRIORITY_COLORS = {
  0: "text-gray-500", // Çok Düşük
  1: "text-blue-500", // Düşük
  2: "text-yellow-500", // Orta
  3: "text-orange-500", // Yüksek
  4: "text-red-500", // Çok Yüksek
};

const LABEL_INFO = {
  1: { name: "Acil", color: "#FF4444" },
  2: { name: "Hata Düzeltme", color: "#FF8C00" },
  3: { name: "Geliştirme", color: "#4169E1" },
  4: { name: "İyileştirme", color: "#32CD32" },
};

const IssueDetailCard: React.FC<Props> = ({ task, onClose }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{task.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Öncelik ve Etiket */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFlag className={PRIORITY_COLORS[task.priorityId as keyof typeof PRIORITY_COLORS]} />
              <span className="text-sm text-gray-600">
                {task.priorityId === 0 ? "Çok Düşük" :
                 task.priorityId === 1 ? "Düşük" :
                 task.priorityId === 2 ? "Orta" :
                 task.priorityId === 3 ? "Yüksek" : "Çok Yüksek"}
              </span>
            </div>
            {task.labelId && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: LABEL_INFO[task.labelId as keyof typeof LABEL_INFO].color }}
                />
                <span className="text-sm text-gray-600">
                  {LABEL_INFO[task.labelId as keyof typeof LABEL_INFO].name}
                </span>
              </div>
            )}
          </div>

          {/* İçerik */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">İçerik</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.explanation}</p>
          </div>

          {/* Açıklama */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Açıklama</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.explanation}</p>
          </div>

          {/* Tarihler */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Başlangıç Tarihi</h3>
              <p className="text-gray-900">{formatDate(task.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bitiş Tarihi</h3>
              <p className="text-gray-900">{formatDate(task.deadLineDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailCard;