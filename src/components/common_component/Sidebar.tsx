import React from "react";
import iconBg from "../../assets/sideBarIconBg.svg";
import MenuIcon1 from "../../assets/menuIcon1.svg";
import MenuIcon2 from "../../assets/MenuIcon2.svg";
import MenuIcon3 from "../../assets/menuIcon3.svg";
import MenuIcon4 from "../../assets/MenuIcon4.svg";
import MenuIcon5 from "../../assets/MenuIcon5.svg";
import MenuIcon6 from "../../assets/MenuIcon6.svg";

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
  const menuItems = [
    {
      icon: MenuIcon1,
      bgColor: "bg-[#FF885B]", // Orange
    },
    {
      icon: MenuIcon2,
      bgColor: "bg-[#A66EFA]", // Purple
    },
    {
      icon: MenuIcon3,
      bgColor: "bg-[#28C76F]", // Green
    },
    {
      icon: MenuIcon4,
      bgColor: "bg-[#EA5455]", // Red
    },
    {
      icon: MenuIcon5,
      bgColor: "bg-[#FFC107]", // Yellow
    },
    {
      icon: MenuIcon6,
      bgColor: "bg-black", // Black
    },
  ];

  return (
    <div
      className={`
        w-16 md:w-20 lg:w-24 
        flex flex-col items-center 
        h-full min-h-screen 
        fixed left-0 top-0 
        z-50 bg-[#1D51A4]
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="mb-2 h-32 w-full "></div>

      <div className="flex flex-col w-full">
        {menuItems.map((item, index) => (
          <div
            className="relative w-full h-24 flex items-center justify-end pr-3"
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
              className="relative z-20 p-0 flex justify-center items-center group focus:outline-none"
            >
              {/* Icon Container with Background Color */}
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${item.bgColor} shadow-lg`}
              >
                {/* Icon Image */}
                <img
                  src={item.icon}
                  alt={`Menu ${index + 1}`}
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
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
