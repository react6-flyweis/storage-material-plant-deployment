import type { TourStepConfig } from "../tour.types";

export const deliverySteps: TourStepConfig[] = [
  {
    id: "del-step-freight-loads",
    route: "/delivery/freight-loads",
    element: '[data-tour="freight-loads-page"]',
    title: "Delivery: Freight Load Postings",
    description:
      "Post freight loads to logistics carriers, manage load requirements, and track open RFQs.",
    speechText:
      "Post freight loads, collect carrier bids, and coordinate shipping parameters.",
    side: "top",
  },
  {
    id: "del-step-awarded-loads",
    route: "/delivery/awarded-loads",
    element: '[data-tour="awarded-loads-page"]',
    title: "Delivery: Awarded Carrier Loads",
    description:
      "Review carriers that won delivery bids, confirm contract rates, and verify driver assignments.",
    speechText:
      "View awarded freight contracts, agreed shipping rates, and confirmed carrier details.",
    side: "top",
  },
  {
    id: "del-step-calendar",
    route: "/delivery/calendar",
    element: '[data-tour="delivery-calendar-page"]',
    title: "Delivery: Dispatch Calendar",
    description:
      "Track scheduled dispatches, pickup windows, and carrier arrivals in interactive Day, Week, and Month views.",
    speechText:
      "Coordinate dispatch schedules and incoming deliveries using the interactive calendar.",
    side: "top",
  },
  {
    id: "del-step-all-deliveries",
    route: "/delivery/all-deliveries",
    element: '[data-tour="all-deliveries-page"]',
    title: "Delivery: All Deliveries Tracking",
    description:
      "Monitor in-transit shipments, gate departures, and completed deliveries with proof of delivery verification.",
    speechText:
      "Track in-transit trucks and review historical delivery logs with proof of delivery records.",
    side: "top",
  },
  {
    id: "del-step-notifications",
    route: "/delivery/notifications",
    element: '[data-tour="delivery-notifications-page"]',
    title: "Delivery: Alerts & Updates",
    description:
      "Receive real-time notifications for dispatch status changes, route milestones, and logistics exceptions.",
    speechText:
      "Stay notified of real-time transit updates, gate check-ins, and delivery alerts.",
    side: "top",
  },
];
