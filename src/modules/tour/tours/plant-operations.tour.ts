import type { TourDefinition } from "../tour.types";
import { dashboardSteps } from "./dashboard.tour";
import { loadPlanningSteps } from "./load-planning.tour";
import { deliverySteps } from "./delivery.tour";

export const plantOperationsTour: TourDefinition = {
  id: "plant-operations",
  name: "Plant Operations & Collaboration Tour",
  description:
    "Complete walkthrough covering dashboard, projects, load planning, delivery, costing, logistics, and team communication.",
  estimatedMinutes: 4,
  steps: [
    // ── Dashboard Section (merged) ─────────────────────────────────────────
    ...dashboardSteps,

    {
      id: "step-sidebar-navigation",
      route: "/dashboard",
      element: '[data-tour="sidebar-nav"]',
      title: "Main Navigation & Panels",
      description:
        "Quickly access Projects, Load Planning, Delivery, Costing, Logistics, and Team Communication with dedicated sub-navigation panels.",
      speechText:
        "Use the complete navigation panel to switch between fabrication projects, load planning, and delivery workflows.",
      side: "right",
    },
    {
      id: "step-projects-tab",
      route: "/projects",
      element: '[data-tour="projects-tab"]',
      title: "Fabrication Projects & Orders",
      description:
        "Track all active production orders, review customer building specs, and monitor drawing approvals.",
      speechText:
        "This is your projects hub. Track fabrication jobs, project drawings, and manufacturing status. Choose Explore Project Details for a full tour of a single project.",
      side: "top",
      branch: {
        tourId: "project-details",
        label: "Explore Project Details (4 min)",
        description:
          "Want a full walkthrough of a project's details page and every page you can open from it?",
      },
    },

    // ── Load Planning Section (merged) ─────────────────────────────────────
    ...loadPlanningSteps,

    // ── Delivery Section (merged) ──────────────────────────────────────────
    ...deliverySteps,

    // ── Other Operational Hubs ──────────────────────────────────────────────
    {
      id: "step-costing",
      route: "/costing",
      element: '[data-tour="costing-tab"]',
      title: "Plant Costing & Material Valuation",
      description:
        "Calculate BOM item costs, manage missing component prices, and monitor fabrication margins.",
      speechText:
        "Analyze production costs, review missing component pricing, and audit material expenses.",
      side: "top",
    },
    {
      id: "step-logistics",
      route: "/logistics/shippers",
      element: '[data-tour="logistics-tab"]',
      title: "Shippers & Freight Carriers",
      description:
        "Maintain approved shipping vendors, carrier contacts, vehicle fleets, and logistics partners.",
      speechText:
        "Manage approved shipper profiles and freight courier contacts in the logistics hub.",
      side: "top",
    },
    {
      id: "step-communication",
      route: "/communication",
      element: '[data-tour="communication-tab"]',
      title: "Internal Team Communication",
      description:
        "Collaborate directly with sales teams, project engineers, and dispatch drivers in real time.",
      speechText:
        "Chat with sales, engineering, and logistics teams in real time in the communication center.",
      side: "top",
    },
    {
      id: "step-notifications",
      route: "/notification",
      element: '[data-tour="notifications-tab"]',
      title: "Notification Center",
      description:
        "Stay updated on order status changes, drawing approvals, freight bids, and urgent system alerts.",
      speechText:
        "Never miss a production milestone or freight alert with real-time notifications.",
      side: "bottom",
    },
    {
      id: "step-header-search",
      route: "",
      element: '[data-tour="header-search"]',
      title: "Instant Global Search",
      description:
        "Quickly locate any project, shipper reference, BOM number, or order from anywhere in the app.",
      speechText:
        "Find any project, drawing, or shipper order instantly with the global search bar.",
      side: "bottom",
    },
    {
      id: "step-tour-hub-btn",
      route: "",
      element: '[data-tour="tour-hub-btn"]',
      title: "Tour Hub & Help",
      description:
        "You're all set! Replay this tour or toggle voice narration anytime right from this help menu.",
      speechText:
        "You're ready to run plant operations! Replay this tour anytime from the Help menu.",
      side: "bottom",
      align: "end",
    },
  ],
};
