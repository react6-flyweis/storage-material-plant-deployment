import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";

const ProjectQuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();

  const actions = [
    { label: "View BOM File", path: `/projects/view-bom/${customerId}/${projectId}` },
    {
      label: "View Drawings & Photos",
      path: `/projects/view-drawings/${customerId}/${projectId}`,
    },
    { label: "Material Delivery", path: `/projects/material-delivery/${customerId}/${projectId}` },
    { label: "View Shipper Files", path: `/projects/shipper-files/${customerId}/${projectId}` },
    {
      label: "Additional Material Request",
      path: `/projects/material-request/${customerId}/${projectId}`,
    },
  ];

  const handleClick = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <Button
        variant="primary"
        size="sm"
          key={index}
          onClick={() => handleClick(action.path)}
          // className="px-3 md:px-6 py-1.5 md:py-3 bg-[#1E51A4] text-white rounded-[8px] text-xs md:text-sm font-inter font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_10px_rgba(30,81,164,0.3)] text-nowrap"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ProjectQuickActions;

