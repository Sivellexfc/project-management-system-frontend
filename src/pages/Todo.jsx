import React, { useState, useEffect } from "react";
import { getMyIssues } from "../services/issueServices/GetMyIssues";
import TodoCard from "../components/Todo/TodoCard";

const Todo = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAssigneesModal, setShowAssigneesModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStepToggle = async (taskId, stepId) => {
    // Burada API'ye istek atılacak
    console.log("Step durumu güncellendi:", taskId, stepId);
  };

  const handleShowAssignees = (task) => {
    setSelectedTask(task);
    setShowAssigneesModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMyIssues();
        console.log(response)
        setProjects(response || []);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-colorFirst"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Yapılacaklar</h1>

      {/* Proje Bazlı Görev Listesi */}
      <div className="space-y-8">
        {projects.map((project) => (
          <div key={`project-${project.projectId}`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {project.projectName}
            </h2>
            <div className="space-y-4">
              {project.issues.map((issue) => (
                <TodoCard
                projectId={project.projectId}
                  key={`issue-${issue.id}`}
                  task={issue}
                  onStepToggle={handleStepToggle}
                  onShowAssignees={handleShowAssignees}
                />
              ))}
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
                <div key={`assignee-${assignee.id}`} className="flex items-center gap-3">
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
