// Navigation configuration for the application

export type ViewType = "main" | "profile" | "settings";

export interface Route {
  id: string;
  name: string;
  path: ViewType;
  icon?: string;
}

export const SPECIAL_ROUTES: Route[] = [
  {
    id: "profile",
    name: "My Profile",
    path: "profile",
  },
  {
    id: "settings",
    name: "Settings",
    path: "settings",
  },
];

// Helper function to get route by path
export const getRouteByPath = (path: ViewType): Route | undefined => {
  return SPECIAL_ROUTES.find((route) => route.path === path);
};

// Helper function to navigate between views
export const canNavigateBetween = (from: ViewType, to: ViewType): boolean => {
  // Profile and Settings can navigate to each other
  if (
    (from === "profile" && to === "settings") ||
    (from === "settings" && to === "profile")
  ) {
    return true;
  }

  // Main can navigate to any view
  if (from === "main") {
    return true;
  }

  // Any view can navigate back to main
  if (to === "main") {
    return true;
  }

  return false;
};
