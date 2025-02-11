import React from "react";
import { Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanCardLabel from "./KanbanCardLabel";

interface Props {
  task: Task;
}

function TaskCard({ task }) {
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
      className="w-full px-4 py-2 bg-colorFirst border-l-[5px] border-[#EED12B] rounded-md hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    >
        <div className="flex justify-between">
            <div>
                <KanbanCardLabel color="#27C356" text="Design"></KanbanCardLabel>
                <KanbanCardLabel color="#2766C3" text="Plan"></KanbanCardLabel>
            </div>
            <div>icon</div>
        </div>
      <div>
        <h2>Header</h2>
        <p>{task.content}</p>
      </div>
      <div>bottom</div>
    </div>
  );
}

export default TaskCard;
