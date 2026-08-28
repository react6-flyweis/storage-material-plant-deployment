import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useLogPageVisitMutation } from "@/redux/api/pageActivityApi";

export function PageActivityTracker() {
  const location = useLocation();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const [logPageVisit] = useLogPageVisitMutation();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      logPageVisit({
        panel: "plant",
        page: location.pathname,
      })
        .unwrap()
        .catch((err) => {
          // Silent or warning log in dev/production to prevent spamming console
          console.warn("Failed to log page activity:", err);
        });
    }
  }, [location.pathname, isAuthenticated, accessToken, logPageVisit]);

  return null;
}
