import React, { useState,useEffect } from "react";
import { FaCheck, FaUsers, FaCalendarAlt, FaTag, FaProjectDiagram, FaExclamationTriangle } from "react-icons/fa";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getMyIssues } from "../services/issueServices/GetMyIssues";

// Klon veri
const MOCK_TASKS = [
  {
    id: 1,
    name: "Ödeme Hatası 3",
    explanation: "Kullanıcılar ödeme yaparken hata alıyor.",
    startDate: "2025-02-10T09:00:00Z",
    deadLineDate: "2025-02-15T18:00:00Z",
    stageId: 2,
    projectId: 1,
    labelId: 1,
    priorityId: 1,
    steps: [
      { id: 1, description: "Hata loglarını incele", isDone: true },
      { id: 2, description: "Ödeme servisini kontrol et", isDone: false },
      { id: 3, description: "Test ortamında test et", isDone: false },
      { id: 4, description: "Canlı ortama deploy et", isDone: false }
    ],
    assignees: [
      { id: 1, name: "Ahmet Yılmaz", avatar: "https://i.pravatar.cc/150?img=1" },
      { id: 2, name: "Mehmet Demir", avatar: "https://i.pravatar.cc/150?img=2" },
      { id: 3, name: "Ayşe Kaya", avatar: "https://i.pravatar.cc/150?img=3" }
    ],
    project: { id: 1, name: "E-Ticaret Projesi" },
    label: { id: 1, name: "Bug", color: "#FF0000" },
    priority: { id: 1, name: "Yüksek", color: "#FF0000" }
  },
  {
    id: 2,
    name: "Performans İyileştirmesi",
    explanation: "Ana sayfa yükleme süresini optimize et.",
    startDate: "2025-02-11T10:00:00Z",
    deadLineDate: "2025-02-16T18:00:00Z",
    stageId: 2,
    projectId: 1,
    labelId: 2,
    priorityId: 2,
    steps: [
      { id: 1, description: "Performans metriklerini topla", isDone: true },
      { id: 2, description: "Bottleneck'leri belirle", isDone: true },
      { id: 3, description: "Optimizasyon yap", isDone: false },
      { id: 4, description: "Test et", isDone: false }
    ],
    assignees: [
      { id: 4, name: "Fatma Şahin", avatar: "https://i.pravatar.cc/150?img=4" },
      { id: 5, name: "Ali Yıldız", avatar: "https://i.pravatar.cc/150?img=5" }
    ],
    project: { id: 1, name: "E-Ticaret Projesi" },
    label: { id: 2, name: "İyileştirme", color: "#00FF00" },
    priority: { id: 2, name: "Orta", color: "#FFA500" }
  }
];

const Todo = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAssigneesModal, setShowAssigneesModal] = useState(false);

  const handleStepToggle = (taskId, stepId) => {
    const updatedTasks = MOCK_TASKS.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: task.steps.map(step => 
            step.id === stepId ? { ...step, isDone: !step.isDone } : step
          )
        };
      }
      return task;
    });
    // Burada API'ye istek atılacak
    console.log("Step durumu güncellendi:", taskId, stepId);
  };

  const getPriorityColor = (priorityId) => {
    switch (priorityId) {
      case 1: return "text-red-500";
      case 2: return "text-orange-500";
      case 3: return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchIssues = async () => {
      const response = await getMyIssues();
    }
    fetchIssues();
  }, [])
  

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Yapılacaklar</h1>

      {/* Görev Listesi */}
      <div className="space-y-4 mx-">
        {MOCK_TASKS.map((task) => (
          <div key={task.id} className="bg-white border border-borderColor rounded-lg shadow-sm p-4 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(34,197,94,0.05) ${0.4 * 100}%, transparent ${0.4 * 100}%)`
          }}
          >
            {/* Görev Başlığı ve Detayları */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
                <p className="text-gray-600 mt-1">{task.explanation}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getPriorityColor(task.priorityId)}`}>
                  <FaExclamationTriangle className="inline mr-1" />
                  {task.priority.name}
                </span>
                <span className="text-sm text-gray-500">
                  <FaTag className="inline mr-1" style={{ color: task.label.color }} />
                  {task.label.name}
                </span>
              </div>
            </div>

            {/* Proje ve Tarih Bilgileri */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FaProjectDiagram className="mr-1" />
                {task.project.name}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                {format(new Date(task.startDate), "dd MMMM yyyy", { locale: tr })} - 
                {format(new Date(task.deadLineDate), "dd MMMM yyyy", { locale: tr })}
              </div>
            </div>

            {/* Adımlar */}
            <div className="space-y-2 mb-4">
              {task.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleStepToggle(task.id, step.id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    step.isDone ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                    {step.isDone && <FaCheck className="text-white text-xs" />}
                  </div>
                  <span className={`${step.isDone ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {step.description}
                  </span>
                </div>
              ))}
            </div>

            {/* Çalışanlar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee) => (
                    <img
                      key={assignee.id}
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                {task.assignees.length > 3 && (
                  <span className="ml-2 text-sm text-gray-500">
                    +{task.assignees.length - 3} kişi
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setShowAssigneesModal(true);
                }}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaUsers className="mr-1" />
                Tümünü Gör
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Çalışanlar Modal */}
      {showAssigneesModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Görevdeki Çalışanlar
            </h3>
            <div className="space-y-3">
              {selectedTask.assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-3">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-gray-700">{assignee.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAssigneesModal(false)}
              className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo; 