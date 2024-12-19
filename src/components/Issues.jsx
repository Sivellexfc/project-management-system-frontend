import React, { useState } from "react";
import TaskCard from "./Kanban/TaskCard";
import { tasks, statuses } from "./Kanban/data-task";

const Issues = () => {
  
  const columns = statuses.map((status) => {
    const taskInColumn = tasks.filter((task) => task.status === status);
    return {
      title : status,
      tasks: taskInColumn,
    };
  });

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="flex divide-x justify-between">
      {columns.map((column) => (
        <div>
          <h1>{column.title}</h1>
          {column.tasks.map((task) => (
            <TaskCard task={task}></TaskCard>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Issues;
