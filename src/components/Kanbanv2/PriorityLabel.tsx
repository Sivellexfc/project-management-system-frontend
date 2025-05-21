import React from 'react';
import PRIORITY from '../utils/Priority';

interface ColorLabelProps {
  priorityId?: number;
}

const PriorityLabel: React.FC<ColorLabelProps> = ({ priorityId }) => {
  if (!priorityId) return null;

  // priorityId'yi indexe çevir
  const priority = PRIORITY.find(p => p.id === priorityId);
  if (!priority) return null;

  // Tailwind class olarak color kullanacağız
  const bgClass = `bg-${priority.color}`;

  return (
    <div
    style={{ backgroundColor: priority.color }}
      className={`inline-block px-2 py-0 text-white font-normal text-[12px] rounded`}
      // inline style kullanma, tailwind class kullanıyoruz
    >
      {priority.name}
    </div>
  );
};

export default PriorityLabel;
