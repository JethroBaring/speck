import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showChevron?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  showChevron = true,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(isOpen ? height : 0);
    }
  }, [isOpen, children]);

  return (
    <Card className={className}>
      <button
        onClick={handleToggle}
        className={`flex w-full justify-between items-center px-4 py-3 text-left text-gray-800 dark:text-white/90 font-semibold transition-all duration-200 ${headerClassName}`}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
        </div>
        {showChevron && (
          <div className="flex items-center">
            <svg
              className={`h-4 w-4 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </button>
      
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: `${contentHeight}px` }}
      >
        <div ref={contentRef} className={`px-4 pb-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </Card>
  );
};

export default Collapsible;