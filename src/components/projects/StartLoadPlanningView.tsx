import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StartLoadPlanningView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (requestId) {
      navigate(`/load_planning/${requestId}/item-analysis`, { replace: true });
    }
  }, [requestId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]" />
    </div>
  );
};

export default StartLoadPlanningView;
