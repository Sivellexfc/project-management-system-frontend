import React from "react";
import KanbanCardLabel from "../../Kanbanv2/KanbanCardLabel";

const UserCard = ({avatar,name,email,lastLogin,band,subBand}) => {

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row justify-between gap-6 items-center">
      <img src={avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
      <span className="text-sm font-semibold">{name}</span>
      </div>
      <span className="text-sm text-gray-500">{email}</span>
      <span className="text-sm font-medium">{band}</span>
      <span className="text-sm text-gray-500">{subBand}</span>
      <KanbanCardLabel color="#27C356" text={subBand}></KanbanCardLabel>
      <span className="text-xs text-gray-400">{lastLogin}</span>
      <div>actions</div>
    </div>
  );
};

export default UserCard;
