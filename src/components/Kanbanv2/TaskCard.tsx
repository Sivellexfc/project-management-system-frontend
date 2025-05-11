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

interface Props {
  task: Task;
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

function TaskCard({ task }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  console.log("task : ", task);
  useEffect(() => {
    setShowDetail(false);
  }, [task]); // Task değiştikçe detay kapanacak


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
  console.log("task.labelId : ", task.labelId)
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: `6px solid ${PRIORITY[task.priorityId]?.color || '#ccc'}`
      }}
      {...(showDetail ? {} : attributes)}
      {...(showDetail ? {} : listeners)}
      className="w-full px-4 py-2 space-y-2 bg-colorFirst border-t border-r border-b border-borderColor rounded-md hover:shadow-md cursor-grab"
    >
      <div className="flex justify-between">
        <h2 className="font-primary text-lg font-normal">{task.name}</h2>
        <button
          onPointerDown={(e) => e.stopPropagation()} // Sürükleme olaylarını engelle
          onClick={(e) => {
            e.stopPropagation(); // Olayın yayılmasını tamamen engelle
            console.log("Button clicked!"); // Test için
            setShowDetail(true);
          }}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <FaInfoCircle size={20} className="opacity-40"/>
        </button>
      </div>
      <div className="space-y-2">
        <div>
          <KanbanCardLabel color={LABELS.find(l => l.id === task.labelId)?.color} text={LABELS.find(l => l.id === task.labelId)?.name}></KanbanCardLabel>
        </div>
        <p className="font-primary text-sm font-light">{task.explanation}</p>
      </div>
      <div></div>
      
      {showDetail &&
        createPortal(
          <IssueDetailCard task={task} onClose={() => setShowDetail(false)} />,
          document.body // Modal'ı body içine ekleriz, böylece sürükleme olaylarından etkilenmez.
        )}
    </div>
  );
}

export default TaskCard;
