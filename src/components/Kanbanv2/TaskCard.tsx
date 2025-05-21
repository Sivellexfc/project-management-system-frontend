import React, { useEffect, useState } from "react";
import { Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanCardLabel from "./KanbanCardLabel";
import { FaInfoCircle } from "react-icons/fa";
import IssueDetailCard from "./IssueDetailCard";
import { createPortal } from "react-dom";
import PRIORITY from "../utils/Priority";
import LABELS from "../utils/Labels";
import Cookies from "js-cookie";
import axios from "axios";
import { getIssue } from "../../services/issueServices/GetIssue";
import { getUsersByIssue } from "../../services/issueServices/GetUsersByIssue";
import { getInitials } from "../utils/GetInitials";
import { getRandomColor } from "../utils/GetRandomColor";
import { GoComment } from "react-icons/go";
import PriorityLabel from "./PriorityLabel";

interface Props {
  task: Task;
}

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  roleName: string;
  assignedById: number;
};

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

function TaskCard({ task }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        // API çağrısı şu an için yorum satırında
        const companyId = Cookies.get("selectedCompanyId");
        const response = await getIssue(task.projectId, task.id);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
      }
    };

    const fetchAssignUsers = async () => {
      setLoadingUsers(true); // Loading başlasın
      try {
        const response = await getUsersByIssue(task.id);
        const userInfos = Object.values(response.result || {}).flat();
        setUsers(userInfos as User[]);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoadingUsers(false); // Loading bitsin
      }
    };

    fetchTask();
    fetchAssignUsers();
    setShowDetail(false);
  }, [task]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
      }}
      {...(showDetail ? {} : attributes)}
      {...(showDetail ? {} : listeners)}
      className="w-full px-4 py-2 space-y-2 bg-colorFirst border-t border-r border-b border-borderColor rounded-md hover:shadow-md cursor-grab"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-raw gap-1 items-center justify-center">
          <h2 className="font-primary text-lg font-normal">{task.name}</h2>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()} // Sürükleme olaylarını engelle
          onClick={(e) => {
            e.stopPropagation(); // Olayın yayılmasını tamamen engelle
            setShowDetail(true);
          }}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <FaInfoCircle size={20} className="opacity-40" />
        </button>
      </div>
      <div className="flex flex-raw gap-1">
        <PriorityLabel priorityId={Number(task.priorityId)} />
        <KanbanCardLabel
          color={LABELS.find((l) => l.id === task.labelId)?.color}
          text={LABELS.find((l) => l.id === task.labelId)?.name}
        ></KanbanCardLabel>
      </div>
      <div className="space-y-2">
        <p className="font-primary text-sm font-light">{task.explanation}</p>
      </div>
      <div className="flex flex-raw justify-between items-center">
        {loadingUsers ? (
          <p className="text-sm text-gray-400 italic animate-pulse">
            Kullanıcılar yükleniyor...
          </p>
        ) : users.length > 0 ? (
          <button
            onPointerDown={(e) => e.stopPropagation()} // Sürükleme olaylarını engelle
            onClick={(e) => {
              e.stopPropagation(); // Olayın yayılmasını tamamen engelle
              console.log("Button clicked!"); // Test için
              setShowDetail(true);
            }}
          >
            <div className="w-min flex flex-row gap-2 bg-gray-100 bg-opacity-50 hover:bg-gray-100 p-2 rounded">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center"
                  title={`${user.firstName} ${user.lastName}`}
                >
                  {false ? (
                    <img
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getRandomColor(
                        user.userId
                      )}`}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </button>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Henüz kullanıcı atanmadı.
          </p>
        )}

        <div>
          <button
            onPointerDown={(e) => e.stopPropagation()} // Sürükleme olaylarını engelle
            onClick={(e) => {
              e.stopPropagation(); // Olayın yayılmasını tamamen engelle
              console.log("Button clicked!"); // Test için
              setShowDetail(true);
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <GoComment size={20} />
          </button>
        </div>
      </div>

      {showDetail &&
        createPortal(
          <IssueDetailCard task={task} onClose={() => setShowDetail(false)} />,
          document.body // Modal'ı body içine ekleriz, böylece sürükleme olaylarından etkilenmez.
        )}
    </div>
  );
}

export default TaskCard;
