import React, { useCallback, useRef, useState } from 'react';

interface ResizeDividerProps {
  onResize: (delta: number) => void;
}

export const ResizeDivider: React.FC<ResizeDividerProps> = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastX.current = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - lastX.current;
      lastX.current = moveEvent.clientX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [onResize]);

  return (
    <div
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onResize(-20);
        if (e.key === 'ArrowRight') onResize(20);
      }}
      className={`w-1.5 flex-shrink-0 cursor-col-resize group relative ${isDragging ? 'bg-[#0077c8]/20' : 'hover:bg-slate-200'} transition-colors rounded`}
    >
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 ${isDragging ? 'bg-[#0077c8]' : 'bg-transparent group-hover:bg-slate-400'} transition-colors`} />
    </div>
  );
};
