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
    if (!projectId) return;
    // if (!projectId || isLoading || isError || !stateData) return;

    // Check if we are at the root level of load planning
    const isRootPath =
      location.pathname === `/load_planning/${projectId}` ||
      location.pathname === `/load_planning/${projectId}/` ||
      location.pathname === `/load_planning/${projectId}/start-load-planning` ||
      location.pathname === `/load_planning/${projectId}/start-load-planning/`;

    if (isRootPath) {
      navigate(`/load_planning/${projectId}/item-analysis`, { replace: true });
      // const { bundlePlan, } = stateData;
      // if (!bundlePlan) {
      //   // Step 1: No bundle plan generated yet, go to Item Analysis
      //   navigate(`/load_planning/${projectId}/item-analysis`, { replace: true });
      // } else if (bundlePlan.status !== "confirmed") {
      //   // Step 2: Bundle plan exists but not confirmed, go to Bundle Planner
      //   navigate(`/load_planning/${projectId}/bundle-planner`, { replace: true });
      // } else {
      //   // Step 3: Bundle plan confirmed, proceed to Truckload Optimization
      //   navigate(`/load_planning/${projectId}/truck-optimizer`, { replace: true });
    }
    // }
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
