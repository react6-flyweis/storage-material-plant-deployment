import React, { useEffect } from "react";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import { useGetLoadPlanningStateQuery } from "@/redux/api/shipperApi";

const ProjectLoadPlanningView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: stateData, isLoading, isError } = useGetLoadPlanningStateQuery(projectId || "", {
    skip: !projectId,
  });

  useEffect(() => {
    if (!projectId || isLoading || isError || !stateData) return;

    const REDIRECT_TO_STATE = import.meta.env.DEV ? false : true;
    if (REDIRECT_TO_STATE) {

      if (stateData.packingListPlan?.status === "confirmed") {
        navigate(`/load_planning/${projectId}/load-plan-review`, { replace: true });
        return;
      }
      if (stateData.packingListPlan) {
        navigate(`/load_planning/${projectId}/truck-optimizer`, { replace: true });
        return;
      }
      if (stateData.bundlePlan) {
        navigate(`/load_planning/${projectId}/bundle-planner`, { replace: true });
        return;
      }
    }

    // Check if we are at the root level of load planning
    const isRootPath =
      location.pathname === `/load_planning/${projectId}` ||
      location.pathname === `/load_planning/${projectId}/` ||
      location.pathname === `/load_planning/${projectId}/start-load-planning` ||
      location.pathname === `/load_planning/${projectId}/start-load-planning/`;

    if (isRootPath) {
      navigate(`/load_planning/${projectId}/item-analysis`, { replace: true });
    }

  }, [projectId, stateData, isLoading, isError, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]" />
      </div>
    );
  }

  // If there's an error loading the state, we can still render the children (or an error message)
  // Rendering the children allows the user to try and navigate manually
  return <Outlet />;
};

export default ProjectLoadPlanningView;
