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
    id: "del-step-freight-row",
    route: "/delivery/freight-loads",
    element: '[data-tour="freight-load-row-view"]',
    title: "Delivery: View Bids",
    description:
      "<b>View</b> opens the load's bids, where you can award it or request a revision.",
    speechText: "View opens the bids for a load.",
    side: "left",
    locked: true,
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
    id: "del-step-awarded-row",
    route: "/delivery/awarded-loads",
    element: '[data-tour="awarded-load-row-view"]',
    title: "Delivery: View an Awarded Load",
    description:
      "<b>View</b> reopens the request with its winning bid.",
    speechText: "View reopens the request with its winning bid.",
    side: "left",
    locked: true,
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
    id: "del-step-calendar-controls",
    route: "/delivery/calendar",
    element: '[data-tour="delivery-calendar-controls"]',
    title: "Delivery: Calendar Controls",
    description:
      "Move between dates and switch between Day, Week and Month.",
    speechText: "Move between dates and switch views here.",
    side: "bottom",
    locked: true,
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
    id: "del-step-all-row",
    route: "/delivery/all-deliveries",
    element: '[data-tour="all-deliveries-row"]',
    title: "Delivery: Open a Delivery",
    description:
      "Click a row to open the delivery, where you can reschedule, edit, update its status and more.",
    speechText: "Click a row to open that delivery.",
    side: "bottom",
    locked: true,
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
  {
    id: "del-step-notification-resend",
    route: "/delivery/notifications",
    element: '[data-tour="delivery-notification-resend"]',
    title: "Delivery: Resend",
    description:
      "Sends a notification again after you confirm.",
    speechText: "Resend a notification from here.",
    side: "left",
    locked: true,
  },
];
