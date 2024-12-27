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

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const updateTask = (task: Task) => {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t
    })
    setTasks(updatedTasks)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id === parseInt(id))
    if(task) {
      updateTask({...task, status})
    }
  }

  const updateTaskPoints = (task: Task, point: number) => {
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? {...t,point} : t;
    });
  };

  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
  const handleDragEnter = (status: Status) => {
    setCurrentlyHoveringOver(status)
  }
  return (
    <div className="flex divide-x justify-between w-[100%] ">
      {columns.map((column) => (
        <div
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
        >
          <div className="flex justify-between text-2xl p-2 font-medium text-gray-500">
            <h2 className="capitalize">{column.status}</h2>
            {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
          </div>
          <div className={`h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
          {column.tasks.map((task) => (
            <TaskCard
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
