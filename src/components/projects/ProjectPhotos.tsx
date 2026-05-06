import React from "react";
import SubHeading from "../common_component/SubHeading";
import placeholder from "@/assets/images/projectImgPlacholder.svg";
import placeholder2 from "@/assets/images/projectImgPlacholder2.svg";

const ProjectPhotos: React.FC = () => {
  const photos = [placeholder, placeholder, placeholder2, placeholder, placeholder2];

  return (
    <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm">
      <SubHeading text="Project Photos (Latest)" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="rounded-[14px] overflow-hidden border-2 border-dashed border-[#C5C5C5] bg-white hover:border-(--button-bg-primary-color) transition-colors duration-300"
          >
            <img 
              src={photo} 
              alt={`Project ${index + 1}`} 
              className="w-full h-35 md:h-42 object-cover rounded-[14px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPhotos;
