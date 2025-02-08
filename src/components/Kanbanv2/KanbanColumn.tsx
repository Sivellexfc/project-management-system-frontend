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
    console.log("dragginnnn")
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md items-center justify-between bg-slate-400"
      >
        
      </div>
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
      className="w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md items-center justify-between bg-slate-400"
    >
      <div {...attributes} {...listeners} className="cursor-grab bg-zinc-700">
        <div></div>
        {column.title}
      </div>
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-auto overflow-y-hidden">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task}></TaskCard>
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          createTask(column.id);
        }}
      >
        Add Task
      </button>
    </div>
  );
}

export default KanbanColumn;
