import React, { useMemo } from "react";
import { Column, Id, Task } from "./types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  createTask: (columnId: Id) => void;
  tasks: Task[];
}

function KanbanColumn(props: Props) {
  const { column, createTask, tasks } = props;

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

  const tasksId = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  function createTaskFunc(id: Id) {
    createTask(column.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[600px] flex flex-col 
      rounded-md items-center justify-between"
    >
      <div className="w-full flex justify-start h-10 items-center">
        <div className="w-5 h-5 bg-[#EED12B] rounded-full mr-2 shrink-0"></div>
        <div className="w-full cursor-grab">{column.title}</div>
      </div>

      <div className="w-full border-dashed border-2 py-4 items-center flex justify-center rounded-md hover:border-[#737373] opacity-60 hover:opacity-80 cursor-pointer">
        <button
          className="w-full font-bold"
          onClick={() => {
            createTask(column.id);
          }}
        >
          +
        </button>
      </div>
      <div className="space-y-2 w-full flex flex-col flex-grow overflow-x-auto overflow-y-visible">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task}></TaskCard>
          ))}
        </SortableContext>
      </div>
      
    </div>
  );
}

export default KanbanColumn;
