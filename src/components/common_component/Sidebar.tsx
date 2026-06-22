import React from "react";
import iconBg from "../../assets/sideBarIconBg.svg";
import { NAV_ITEMS } from "@/config/navigation.config";

interface SidebarProps {
  isOpen: boolean;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div
      className={`
            w-14 md:w-16 lg:w-20
            flex flex-col items-center
            h-screen
            fixed left-0 top-0
            z-50 bg-[#1D51A4]
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
    >
      <div className="mb-2 h-32 w-full "></div>

      <div className="flex flex-col w-full">
        {NAV_ITEMS.map((item, index) => (
          <div
            className="relative w-full h-19 flex items-center justify-end pr-3"
            key={index}
          >
            {activeTab === index && (
              <div className="absolute inset-y-0 right-0 h-full w-full z-10 pointer-events-none flex justify-end">
                <img
                  src={iconBg}
                  alt=""
                  className="h-full w-auto object-contain"
                />
              </div>
            )}

            <button
              onClick={() => setActiveTab(index)}
              className="relative z-20 p-0 flex items-center group focus:outline-none"
            >
              {/* Hover Label Pill */}
              <div className="absolute left-[-4px] flex items-center bg-white rounded-full py-1 pl-1 pr-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1),0_8px_8px_-6px_rgba(0,0,0,0.1)] z-10 -translate-x-1 group-hover:translate-x-0">
                {/* Spacer to keep text to the right of the icon */}
                <div className="w-10 h-10 shrink-0" />
                <span className="ml-4 font-normal text-black text-base lg:text-[17px] tracking-tight">
                  {item.title}
                </span>
              </div>

              {/* Icon Container */}
              <div
                className={`relative z-30 w-10 h-10 p-1.5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${item.color} shadow-lg`}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-5.5 h-5.5 object-contain"
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
