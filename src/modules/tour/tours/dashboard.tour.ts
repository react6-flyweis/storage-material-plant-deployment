import type { TourStepConfig } from "../tour.types";

export const dashboardSteps: TourStepConfig[] = [
  {
    id: "dash-step-overview",
    route: "/dashboard",
    element: '[data-tour="dashboard-overview"]',
    title: "Dashboard: Plant Command Center",
    description:
      "Your daily starting point. The dashboard summarizes every active steel building project, production output, incoming shipper files, and alerts in one place.",
    speechText:
      "Welcome to your plant command center. Let's walk through each section of the dashboard.",
    side: "bottom",
  },
  {
    id: "dash-step-refresh",
    route: "/dashboard",
    element: '[data-tour="dashboard-refresh"]',
    title: "Dashboard: Refresh Data",
    description:
      "Pull the latest figures from the server at any time. The icon spins while fresh data is loading.",
    speechText: "Use the refresh button to reload the latest dashboard figures.",
    side: "left",
    align: "start",
  },
  {
    id: "dash-step-stats",
    route: "/dashboard",
    element: '[data-tour="dashboard-stats"]',
    title: "Dashboard: Project Status at a Glance",
    description:
      "Five headline counters: Total Projects, In Production, Ready to Dispatch, Dispatched Today, and Pending Approval. Use them to spot bottlenecks between fabrication and dispatch.",
    speechText:
      "These cards show total projects, what's in production, ready to dispatch, dispatched today, and pending approval.",
    side: "bottom",
  },
  {
    id: "dash-step-production-overview",
    route: "/dashboard",
    element: '[data-tour="dashboard-production-overview"]',
    title: "Dashboard: Production Overview",
    description:
      "Compare planned vs. produced tonnage, plant utilization, on-time delivery, and rework/rejection rates. Switch the period between Today, This Week, and This Month using the filter on the right.",
    speechText:
      "Production overview compares planned and produced tonnage, utilization, on-time delivery, and rework rates. Change the period with the filter.",
    side: "bottom",
  },
  {
    id: "dash-step-shipper-files",
    route: "/dashboard",
    element: '[data-tour="dashboard-shipper-files"]',
    title: "Dashboard: Recent Shipper Files",
    description:
      "New shipper files appear here in real time as they arrive, with their received date and processing status.",
    speechText:
      "Recently received shipper files show up here live, along with their status.",
    side: "right",
  },
  {
    id: "dash-step-plant-alerts",
    route: "/dashboard",
    element: '[data-tour="dashboard-plant-alerts"]',
    title: "Dashboard: Plant Alerts",
    description:
      "The five most recent plant alerts, such as delays, material shortages, or approvals needing attention, are pushed here live.",
    speechText:
      "Plant alerts highlight the latest issues that need your attention.",
    side: "bottom",
  },
  {
    id: "dash-step-freight-carriers",
    route: "/dashboard",
    element: '[data-tour="dashboard-freight-carriers"]',
    title: "Dashboard: Freight Carriers",
    description:
      "See which freight carriers are engaged and the status of their current loads, so you can coordinate pickups with the yard.",
    speechText:
      "The freight carriers panel shows active carriers and their load status.",
    side: "left",
  },
  {
    id: "dash-step-shipper-files-table",
    route: "/dashboard",
    element: '[data-tour="dashboard-shipper-files-table"]',
    title: "Dashboard: Shipper Files Table",
    description:
      "A detailed table of recent shipper files with full reference details for quick review and follow-up.",
    speechText:
      "This table lists recent shipper files in detail for review.",
    side: "top",
  },
  {
    id: "dash-step-shipper-file-view",
    route: "/dashboard",
    element: '[data-tour="dashboard-shipper-file-view"]',
    title: "Dashboard: View a Shipper File",
    description:
      "The <b>eye</b> button on each row opens that shipper file so you can review it.",
    speechText: "Use the eye button to open a shipper file.",
    side: "left",
    locked: true,
    optional: true,
  },
  {
    id: "dash-step-drawing-approvals",
    route: "/dashboard",
    element: '[data-tour="dashboard-drawing-approvals"]',
    title: "Dashboard: Drawing Approval Status",
    description:
      "Track which project drawings are approved, pending, or sent back for revision before fabrication can start.",
    speechText:
      "Track drawing approvals here before projects move into fabrication.",
    side: "top",
  },
  {
    id: "dash-step-drawing-view",
    route: "/dashboard",
    element: '[data-tour="dashboard-drawing-view"]',
    title: "Dashboard: View Drawings",
    description:
      "This button opens the drawings of that row's project.",
    speechText: "Use this button to open that project's drawings.",
    side: "left",
    locked: true,
    optional: true,
  },
];
