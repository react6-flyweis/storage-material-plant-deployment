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
    {
      label: "View BOM File",
      path: `/projects/${projectId}/view-bom`,
      tourId: "project-action-view-bom",
    },
    {
      label: "View Drawings & Photos",
      path: `/projects/${projectId}/view-drawings`,
      tourId: "project-action-view-drawings",
    },
    {
      label: "Material Delivery",
      path: `/projects/${projectId}/material-delivery`,
      tourId: "project-action-material-delivery",
    },
    {
      label: "View Shipper Files",
      path: `/projects/${projectId}/shipper-files`,
      tourId: "project-action-shipper-files",
    },
    {
      label: "Material Orders",
      path: `/projects/${projectId}/material-request`,
      tourId: "project-action-material-orders",
    },
  ];

  const handleClick = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <div data-tour="project-quick-actions" className="flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <Button
          variant="primary"
          size="sm"
          key={index}
          data-tour={action.tourId}
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
