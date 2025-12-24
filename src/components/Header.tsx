import React from "react";
import logo from "../assets/logo.svg";
import bellIcon from "../assets/bellIcon.svg";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="flex flex-wrap justify-between items-start md:items-center py-1 md:py-4 bg-white sticky top-0 z-40 px-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex w-full md:w-auto items-center gap-4 mb-4 md:mb-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-black-600 hover:text-gray-900 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div className="w-full lg:w-[400px] sm:w-[40dvw] sm:block hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by equipment name, ID, category, project, or material..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-[#0a3a8b] focus:border-[#0a3a8b] sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-6 w-full md:w-auto justify-end">
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700 relative">
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
            <img
              src={bellIcon}
              alt=""
              className="w-8 h-8 cursor-pointer object-contain"
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-31 h-12 rounded-full object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
