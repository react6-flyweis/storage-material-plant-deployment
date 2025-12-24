import React from "react";
import { NAV_ITEMS } from "../constants/navigation";

interface SidePanelProps {
  isOpen: boolean;
  activeTab: number;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  activeTab,
  activeSubTab,
  setActiveSubTab,
}) => {
  const baseTop = 152;
  const itemHeight = 96;
  const topPosition = baseTop + activeTab * itemHeight;

  const currentNav = NAV_ITEMS[activeTab];

  return (
    <div
      className={`
        w-54 min-h-screen 
        fixed left-16 md:left-20 lg:left-24 top-0 
        z-100
        flex flex-col 
        transition-all duration-300 ease-in-out
        overflow-y-auto
        
        ${isOpen ? "translate-x-0" : "-translate-x-[200%] lg:translate-x-0"}
        ${"bg-[#E5ECFF] p-3 pt-6"}
      `}
    >
      <div className="flex flex-col h-full fade-in duration-300">
        <div className="mb-2">
          <h2 className="text-(--text-color-primary-blue) font-bold text-lg leading-tight mb-1">
            Plant Panel
          </h2>
          <p className="text-black text-sm font-normal">
            Plant1234@steelpro.com
          </p>
        </div>

        <div className="flex items-center justify-between rounded-md p-1 mb-6">
          <span className="md:text-md text-black font-normal  bg-[#D8DEEA] px-10 py-1">
            {"TODAY"}
          </span>
          <div className="flex">
            <button className="p-1 hover:bg-gray-300 rounded text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="#6A6B6C"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-300 rounded text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="#6A6B6C"
                className="w-4  h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Button Group */}
      <div
        className="absolute left-4 right-4 transition-all duration-300 ease-out pointer-events-auto"
        style={{ top: `${topPosition}px` }}
      >
        {/* Render Items */}
        {currentNav.items.length === 0 ? (
          <button
            className={`w-full text-white rounded-lg md:py-3 py-2 font-medium shadow-sm mb-3 ${currentNav.color}`}
          >
            {currentNav.title}
          </button>
        ) : (
          // Render sub-items
          <div className="flex flex-col gap-2 fade-in pl-0">
            {currentNav.items.map((item, idx) => {
              const isActive = activeSubTab === item;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSubTab(item)}
                  className={`w-full py-3 px-4 rounded-lg shadow-sm text-left text-sm transition-colors font-semibold
                       ${
                         isActive
                           ? `${currentNav.color} text-white`
                           : "bg-white text-gray-600 hover:bg-gray-50"
                       }
                     `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
