import React from "react";
import { Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanCardLabel from "./KanbanCardLabel";

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
      style={style}
      {...attributes}
      {...listeners}
      className="w-full px-4 py-2 space-y-2 bg-colorFirst border-l-[5px] border-[#EED12B] rounded-md  hover:shadow-md cursor-grab"
    >
      <div className="flex justify-between">
        <h2 className="font-primary text-lg font-normal">{task.name}</h2>
        <div>icon</div>
      </div>
      <div className="space-y-2">
        <div>
          <KanbanCardLabel color="#27C356" text="Design"></KanbanCardLabel>
          <KanbanCardLabel color="#2766C3" text="Plan"></KanbanCardLabel>
        </div>
        <p className="font-primary text-sm font-light">{task.explanation}</p>
      </div>
      <div></div>
    </div>
  );
}

export default TaskCard;
