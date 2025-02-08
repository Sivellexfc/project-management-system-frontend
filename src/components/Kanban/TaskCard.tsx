import React, { useState } from "react";
import { CgDanger } from "react-icons/cg";
import { RiArrowDownDoubleFill } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";
import { Task } from "./data-task";
import KanbanCardLabel from "./KanbanCardLabel";
import { BsMenuButton } from "react-icons/bs";
import { IoIosMove } from "react-icons/io";

const TaskCard = ({
  task,
  updateTask,
}: {
  task: Task;
  updateTask: (task: Task) => void;
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const points = task.points || 0;
  const updatePoints = (direction: "up" | "down") => {
    const fib = [0, 1, 2, 3, 5, 8, 13];
    const index = fib.indexOf(points);
    const nextIndex = direction === "up" ? index + 1 : index - 1;
    const newPoints = fib[nextIndex];
    if (newPoints) {
      updateTask({ ...task, points: newPoints });
    }
  };

  const handleDragStart = (e, task) => {
  };

  return (
    <div
      draggable
      onDrag={(e) => {
        e.currentTarget.style.opacity = "1"; 
      }}
      onDragStart={(e) => {
        handleDragStart(e, task);
        e.dataTransfer.setData("id", task.id);
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity = "1"; 
      }}
      className="rounded-md p-4 m-2 bg-colorFirst"
    >
      <div className="flex justify-between">
          <div>
            <KanbanCardLabel color="#27C356" text="Design"></KanbanCardLabel>
            <KanbanCardLabel color="#2766C3" text="Plan"></KanbanCardLabel>
          </div>
          <IoIosMove size={20}/>
        </div>
      <div className="text-base font-base py-2">
        {isEditingTitle ? (
          <input
            autoFocus
            className="w-full"
            onBlur={() => setIsEditingTitle(false)}
            value={task.title}
            onChange={(e) => updateTask({ ...task, title: e.target.value })}
          />
        ) : (
          <div onClick={() => setIsEditingTitle(true)}>{task.title}</div>
        )}
      </div>
      <div className="flex gap-4 justify-between py-2 text-gray-500 text-sm">
        
        <div></div>
        <div></div>

        <div className="flex gap-2">
          <div>{task.id}</div>
          {task.priority === "high" && (
            <div>
              <CgDanger color="red"></CgDanger>
            </div>
          )}
          {task.priority === "medium" && (
            <div>
              <RiArrowDownDoubleFill color="orange"></RiArrowDownDoubleFill>
            </div>
          )}
          {task.priority === "low" && (
            <div>
              <RiArrowDownSLine color="green"></RiArrowDownSLine>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => updatePoints("down")}>-</button>
          <div className="font-bold">{points}</div>
          <button onClick={() => updatePoints("up")}>+</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
