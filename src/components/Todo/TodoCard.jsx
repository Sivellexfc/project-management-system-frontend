import React, { useState, useEffect } from "react";
import { FaCheck, FaUsers, FaCalendarAlt, FaTag, FaProjectDiagram, FaExclamationTriangle } from "react-icons/fa";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getStepsByIssueId } from "../../services/issueServices/GetIssueStepsById";
import { updateStep } from "../../services/issueServices/UpdateStep";
import { updateIssueStage } from "../../services/issueServices/UpdateIssueStage";

const TodoCard = ({ task, onStepToggle, onShowAssignees,projectId }) => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const getPriorityColor = (priorityName) => {
    switch (priorityName?.toLowerCase()) {
      case "high": return "text-red-500";
      case "medium": return "text-orange-500";
      case "low": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        const response = await getStepsByIssueId(task.issueId);
        console.log("steps", response.result);
        setSteps(response.result || []);
      } catch (error) {
        console.error("Adımlar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, [task.issueId]);

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setShowConfirmModal(true);
  };

  const handleConfirmStep = async () => {
    try {
      await updateStep(task.issueId, selectedStep.id, {
        description: selectedStep.description,
        isDone: !selectedStep.isDone
      });

      // Adımları yeniden çek
      const response = await getStepsByIssueId(task.issueId);
      setSteps(response.result || []);
      
      setShowConfirmModal(false);
      setSelectedStep(null);
    } catch (error) {
      console.error("Adım güncellenirken hata oluştu:", error);
    }
  };

  const handleCompleteIssue = async () => {
    try {
      await updateIssueStage(projectId, task.issueId, "DONE");
      setShowCompleteModal(false);
      // Burada parent component'e bildirim gönderilebilir
      if (onStepToggle) {
        onStepToggle(task.issueId);
      }
    } catch (error) {
      console.error("Issue tamamlanırken hata oluştu:", error);
    }
  };

  const allStepsCompleted = steps.length > 0 && steps.every(step => step.isDone);

  return (
    <div className="bg-white border border-borderColor rounded-lg shadow-sm p-4 relative overflow-hidden">
      {/* Görev Başlığı ve Detayları */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.issueName}</h3>
          <p className="text-gray-600 mt-1">{task.explanation}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${getPriorityColor(task.priorityName)}`}>
            <FaExclamationTriangle className="inline mr-1" />
            {task.priorityName}
          </span>
          <span className="text-sm text-gray-500">
            <FaTag className="inline mr-1" />
            {task.labelName}
          </span>
        </div>
      </div>

      {/* Proje ve Tarih Bilgileri */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <FaProjectDiagram className="mr-1" />
          {task.projectName}
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-1" />
          {format(new Date(task.startDate), "dd MMMM yyyy", { locale: tr })} - 
          {format(new Date(task.deadLineDate), "dd MMMM yyyy", { locale: tr })}
        </div>
      </div>

      {/* Adımlar */}
      <div className="space-y-2 mb-4">
        {loading ? (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-colorFirst"></div>
          </div>
        ) : (
          steps.map((step) => (
            <div
              key={`step-${step.id}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => handleStepClick(step)}
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
          ))
        )}
      </div>

      {/* Çalışanlar ve Tamamlama Butonu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {task.assignees?.slice(0, 3).map((assignee) => (
              <img
                key={`assignee-${assignee.id}`}
                src={assignee.avatar}
                alt={assignee.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          {task.assignees?.length > 3 && (
            <span className="ml-2 text-sm text-gray-500">
              +{task.assignees.length - 3} kişi
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onShowAssignees(task)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaUsers className="mr-1" />
            Tümünü Gör
          </button>
          {allStepsCompleted && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
            >
              <FaCheck className="mr-1" />
              Tamamla
            </button>
          )}
        </div>
      </div>

      {/* Onay Modalı */}
      {showConfirmModal && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Adımı {selectedStep.isDone ? "Geri Al" : "Tamamla"}
            </h3>
            <p className="text-gray-600 mb-6">
              "{selectedStep.description}" adımını {selectedStep.isDone ? "geri almak" : "tamamlamak"} istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedStep(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmStep}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                {selectedStep.isDone ? "Geri Al" : "Tamamla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tamamlama Onay Modalı */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Görevi Tamamla
            </h3>
            <p className="text-gray-600 mb-6">
              Tüm adımlar tamamlandı. Bu görevi tamamlamak istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleCompleteIssue}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCard; 