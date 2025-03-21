import React, { useEffect, useMemo, useState } from "react";
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
import { columns as initialColumns } from "./datas";
import { useParams } from "react-router-dom";
import { getIssuesByProjectId } from "../../services/issueServices/GetIssuesByProjectId";
import Cookies from "js-cookie";

const KanbanBoard = ({}) => {
  const { projectId } = useParams();
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getIssuesByProjectId(Cookies.get("selectedCompanyId"),Number(projectId));
      if (response.isSuccess) {
        console.log(tasks);
        console.log(response);
      
        // ID değerlerini string'e dönüştürerek setTasks ile güncelleme
        const updatedTasks = response.result.map((task) => ({
          ...task,
          id: String(task.id), // ID'yi string'e çevir
        }));
      
        setTasks((prevTasks) => [...prevTasks, ...updatedTasks]);
      }
      else {
        setError('Görevler yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Görevler yüklenirken bir hata oluştu.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


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
                  tasks={tasks.filter((task) => task.stageId === col.id)}
                ></KanbanColumn>
              ))}
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <KanbanColumn
                  tasks={tasks.filter(
                    (task) => task.stageId === activeColumn.id
                  )}
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
          updatedTasks[activeTaskIndex].stageId =
            prevTasks[overTaskIndex].stageId;
          return arrayMove(updatedTasks, activeTaskIndex, overTaskIndex);
        } else if (overType === "Column") {
          // Eğer doğrudan bir Kolon'un içine bırakıldıysa:
          updatedTasks[activeTaskIndex].stageId = overId;
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
        tasks[activeIndex].stageId = tasks[overIndex].stageId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].stageId = overId;

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
