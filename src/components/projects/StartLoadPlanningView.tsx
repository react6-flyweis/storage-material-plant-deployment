import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const StartLoadPlanningView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate()

  if (projectId) {
    navigate(`/load_planning/${projectId}`)
  }


  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]" />
    </div>
  );
};

export default StartLoadPlanningView;
