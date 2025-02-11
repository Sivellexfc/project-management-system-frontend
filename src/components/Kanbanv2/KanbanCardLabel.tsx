import React from 'react';

interface ColorLabelProps {
  text: string;
  color: string; // Burada, renk istenilen şekilde değiştirilebilir (hex, rgb, tailwind renk sınıfı vb.)
}

const KanbanCardLabel: React.FC<ColorLabelProps> = ({ text, color }) => {
  return (
    <div
      className="inline-block px-4 py-0 text-white font-normal text-[12px]"
      style={{
        backgroundColor: color,  // Dinamik renk ayarlaması
        borderRadius: '16px',    // Yuvarlak köşeler
      }}
    >
      {text}
    </div>
  );
};

export default KanbanCardLabel;