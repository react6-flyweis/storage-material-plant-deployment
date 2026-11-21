export type TourId = "plant-operations" | "order-flow" | "project-details";

/** Offers a jump into a more detailed tour from this step. */
export interface TourStepBranchConfig {
  tourId: TourId;
  label: string;
  description?: string;
  /** Step of the current tour to resume at afterwards. Defaults to the next step. */
  resumeStepIndex?: number;
}

/**
 * The in-page control a user clicks to reach this step's page (a row's View
 * button, a quick-action button...). The tour highlights it before moving on.
 */
export interface TourStepViaConfig {
  /** Page the control lives on. May contain route params like `:projectId`. */
  fromRoute: string;
  element: string;
  title: string;
  description: string;
  speechText?: string;
}

export interface TourStepConfig {
  id: string;
  /** May contain `:projectId` / `:requestId`; resolved at runtime. */
  route: string;
  element: string;
  title: string;
  description: string;
  speechText?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  branch?: TourStepBranchConfig;
  via?: TourStepViaConfig;
  /** Target may legitimately be absent (depends on data); skip quickly if so. */
  optional?: boolean;
}

export interface TourDefinition {
  id: TourId;
  name: string;
  description: string;
  estimatedMinutes: number;
  steps: TourStepConfig[];
}
