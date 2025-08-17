
import React, { useRef, useEffect, useState } from 'react';

export interface Tab {
  value: string;
  label: string;
  minStatus?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabValue: string) => void;
  className?: string;
  showScrollbar?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  showScrollbar = true,
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);

  const baseNavClasses = "-mb-px flex overflow-x-auto relative";
  const scrollbarClasses = showScrollbar 
    ? "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5"
    : "";
  
  const navClasses = `${baseNavClasses} ${scrollbarClasses} ${className}`.trim();

  // Update indicator position and width
  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.value === activeTab);
    if (activeTabIndex >= 0 && tabRefs.current[activeTabIndex] && navRef.current) {
      const activeTabElement = tabRefs.current[activeTabIndex];
      const navElement = navRef.current;
      
      const tabRect = activeTabElement.getBoundingClientRect();
      const navRect = navElement.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav ref={navRef} className={navClasses}>
      {tabs.map((tab, index) => (
        <button
          type="button"
          key={tab.value}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          onClick={() => onTabChange(tab.value)}
          className={`inline-flex gap-2 flex-1 justify-center items-center border-b-2 px-2.5 py-3 text-sm font-medium transition-all duration-300 ease-out min-w-0 ${
            activeTab === tab.value
              ? "text-brand-500 dark:text-brand-400 border-transparent"
              : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
      
      {/* Sliding background highlight */}
      <div 
        className="absolute inset-0 bg-brand-50 dark:bg-brand-500/[0.12] transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
      
      {/* Sliding indicator */}
      <div 
        className="absolute bottom-0 h-0.5 bg-brand-500 dark:bg-brand-400 transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </nav>
    </div>
  );
};

export default Tabs;