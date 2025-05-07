import React, { useMemo, useState } from "react";
import { Column, Id, Task } from "./types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

interface Props {
  column: Column;
  tasks: Task[];
}

function KanbanColumn(props: Props) {
  const { column, tasks } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  console.log(column.color);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md items-center justify-between bg-slate-400"
      ></div>
    );
  }

  const tasksId = tasks.map((task) => task.id); // useMemo yerine doğrudan

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-1 h-[700px] flex flex-col 
      rounded-md items-center justify-between"
    >
      <div className="w-full flex justify-start h-10 items-center">
        <div
          style={{ backgroundColor: column.color }}
          className="w-5 h-5 rounded-full mr-2 shrink-0"
        ></div>

        <div className="w-full cursor-grab">{column.title}</div>
      </div>

      <div className="w-full border-dashed border-2 py-4 items-center flex justify-center rounded-md hover:border-[#737373] opacity-60 hover:opacity-80 cursor-pointer">
        <button
          className="w-full font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>
      <div className="mt-5 w-full flex-1 overflow-y-auto overflow-x-hidden space-y-2">
      <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task}></TaskCard>
          ))}
        </SortableContext>
      </div>

      {/* Modal */}
      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default KanbanColumn;
