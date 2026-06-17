import React from "react";
import SubHeading from "../common_component/SubHeading";
import { Image } from "lucide-react";

const ProjectPhotos: React.FC = () => {
  const placeholders = Array.from({ length: 5 });

  return (
    <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm">
      <SubHeading text="Project Photos (Latest)" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {placeholders.map((_, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-[#C5C5C5] bg-[#F8FAFC] h-35 md:h-42 hover:border-[#1E51A4] hover:bg-[#F1F5F9] transition-all duration-300 group cursor-pointer"
          >
            <Image className="w-8 h-8 text-[#94A3B8] group-hover:text-[#1E51A4] transition-colors duration-300" />
            <span className="text-xs text-[#94A3B8] mt-2 group-hover:text-[#1E51A4] transition-colors duration-300">Photo Placeholder</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPhotos;


