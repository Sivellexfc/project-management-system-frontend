import React, { useState } from "react";
import TaskCard from "./Kanban/TaskCard";
import { tasks as initialTasks, statuses } from "./Kanban/data-task";
import { Task,Status } from "./Kanban/data-task";

const Issues = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columns = statuses.map((status) => {
    const taskInColumn = tasks.filter((task) => task.status === status);

    return {
      status,
      tasks: taskInColumn,
    };
  });

  const updateTask = (task: Task) => {
    
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t
    })
    setTasks(updatedTasks)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id === id)
    if(task) {
      updateTask({...task, status})
    }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Drag işlemi bittiğinde opacity değerini sıfırla.
    e.currentTarget.style.opacity = "1";
  };

  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
  const handleDragEnter = (status: Status) => {
    setCurrentlyHoveringOver(status)
  }
  return (
    <div className="flex justify-between w-[100%] asd">
      {columns.map((column) => (
        <div
        key={column.status}
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
          className="flex-1 min-w-[300px] shrink-0"
        >
          <div className="flex justify-between text-2xl p-2 font-medium text-gray-500">
            <h2 className="capitalize">{column.status}</h2>
            {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
          </div>
          <div className={`h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
            />
          ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Issues;
