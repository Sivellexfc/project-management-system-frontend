import React, { useMemo, useState } from "react";
import { Column, Task, Id } from "./types";
import KanbanColumn from "./KanbanColumn";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { tasks as initialTasks } from "./datas";
import { columns as initialColumns } from "./datas";

const KanbanBoard = ({ projectName, projectId }) => {
  
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>([]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function createTask(columnId: Id): void {
    const newTask: Task = {
      id: generateId(),
      title: "title",
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    console.log(tasks);
    setTasks([...tasks, newTask]);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-primary text-3xl font-semibold">Kanban Board</h1>
        <h1 className="font-primary text-2xl font-light">
          {"- " + "Test Projesi"}
        </h1>
      </div>
      <div className="mx-auto flex w-full items-center overflow-x-auto overflow-y-hidden">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={dragOver}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              {columns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                ></KanbanColumn>
              ))}
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <KanbanColumn
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  createTask={createTask}
                  column={activeColumn}
                ></KanbanColumn>
              )}
              {activeTask && <TaskCard task={activeTask}></TaskCard>}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return; // Hedef yoksa işlemi durdur

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return; // Aynı elemansa hiçbir şey yapma

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Eğer kolon sürükleniyorsa, işlem yapma
    if (activeType === "Column") {
      return;
    }

    // Eğer sürüklenen öğe bir Task ise:
    if (activeType === "Task") {
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex((t) => t.id === activeId);
        const updatedTasks = [...prevTasks];

        if (overType === "Task") {
          // Eğer başka bir Task'in üzerine bırakıldıysa:
          const overTaskIndex = prevTasks.findIndex((t) => t.id === overId);
          updatedTasks[activeTaskIndex].columnId =
            prevTasks[overTaskIndex].columnId;
          return arrayMove(updatedTasks, activeTaskIndex, overTaskIndex);
        } else if (overType === "Column") {
          // Eğer doğrudan bir Kolon'un içine bırakıldıysa:
          updatedTasks[activeTaskIndex].columnId = overId;
          return updatedTasks;
        }

        return prevTasks;
      });
    }
  }

  function dragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragStart(event: DragStartEvent) {
    console.log("önce");
    console.log(event.active.data.current);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    console.log("ortada");
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
    console.log("sonra");
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1} `,
    };
    setColumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 100000);
  }
};

export default KanbanBoard;
