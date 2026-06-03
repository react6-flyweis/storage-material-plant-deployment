import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";

interface ProjectQuickActionsProps {
  projectId?: string;
}

const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({
  projectId: propProjectId,
}) => {
  const navigate = useNavigate();
  const { projectId: paramProjectId } = useParams();

  const projectId = propProjectId || paramProjectId;

  const actions = [
    { label: "View BOM File", path: `/projects/${projectId}/view-bom` },
    {
      label: "View Drawings & Photos",
      path: `/projects/${projectId}/view-drawings`,
    },
    {
      label: "Material Delivery",
      path: `/projects/${projectId}/material-delivery`,
    },
    {
      label: "View Shipper Files",
      path: `/projects/${projectId}/shipper-files`,
    },
    {
      label: "Additional Material Request",
      path: `/projects/${projectId}/material-request`,
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
