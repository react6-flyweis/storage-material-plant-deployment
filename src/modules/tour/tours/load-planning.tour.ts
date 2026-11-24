import type { TourStepConfig } from "../tour.types";

export const loadPlanningSteps: TourStepConfig[] = [
  {
    id: "lp-step-bom-files",
    route: "/load_planning/uploaded-bom-files",
    element: '[data-tour="uploaded-bom-files-page"]',
    title: "Load Planning: Uploaded BOM Files",
    description:
      "Manage uploaded Bill of Materials files, review extraction statuses, part weights, and component quantities.",
    speechText:
      "Review uploaded Bill of Materials files, part counts, and import specifications here.",
    side: "top",
  },
  {
    id: "lp-step-bom-row",
    route: "/load_planning/uploaded-bom-files",
    element: '[data-tour="bom-file-row-view"]',
    title: "Load Planning: View a BOM",
    description:
      "The <b>eye</b> button opens that BOM's extracted items, prices and confirmation.",
    speechText: "Use the eye button to open a bill of materials.",
    side: "left",
    locked: true,
  },
  {
    id: "lp-step-shipper-quotation",
    route: "/load_planning/shipper-quotation",
    element: '[data-tour="shipper-quotation-page"]',
    title: "Load Planning: Shipper Files & Quotations",
    description:
      "Collect freight rate quotes from approved shipping vendors and compare carrier bids for project orders.",
    speechText:
      "Compare carrier freight quotations, rates, and shipment estimates for your project orders.",
    side: "top",
  },
  {
    id: "lp-step-shipper-row",
    route: "/load_planning/shipper-quotation",
    element: '[data-tour="shipper-project-row-view"]',
    title: "Load Planning: View Shipper Files",
    description:
      "The <b>eye</b> icon opens every shipper file received for that project.",
    speechText: "Use the eye icon to see a project's shipper files.",
    side: "left",
    locked: true,
  },
  {
    id: "lp-step-load-planning-list",
    route: "/load_planning/list",
    element: '[data-tour="load-planning-page"]',
    title: "Load Planning: Truck Staging",
    description:
      "Plan truck load configurations, balance trailer weights, simulate bundling, and schedule dispatches.",
    speechText:
      "Welcome to load planning. Plan truck loads, manage bundle staging, and verify trailer capacity.",
    side: "top",
  },
  {
    id: "lp-step-load-plan-row",
    route: "/load_planning/list",
    element: '[data-tour="load-plan-row-view"]',
    title: "Load Planning: View a Load Plan",
    description:
      "The <b>eye</b> icon opens the plan: bundles, weight and each truckload.",
    speechText: "Use the eye icon to open a load plan.",
    side: "left",
    locked: true,
  },
  {
    id: "lp-step-packing-list",
    route: "/load_planning/packing-list",
    element: '[data-tour="packing-list-page"]',
    title: "Load Planning: Itemized Packing Lists",
    description:
      "Inspect and export detailed packing lists and shipping manifests for all fabricated materials and crates.",
    speechText:
      "Inspect itemized packing lists and export shipping manifests for yard dispatch.",
    side: "top",
  },
  {
    id: "lp-step-packing-row",
    route: "/load_planning/packing-list",
    element: '[data-tour="packing-list-row-view"]',
    title: "Load Planning: View Packing Lists",
    description:
      "The <b>eye</b> icon opens the project's packing lists, one per truck.",
    speechText: "Use the eye icon to see a project's packing lists.",
    side: "left",
    locked: true,
  },
  {
    id: "lp-step-qr-labels",
    route: "/load_planning/qr-labels",
    element: '[data-tour="qr-labels-page"]',
    title: "Load Planning: QR Codes & Bundle Labels",
    description:
      "Generate and print scannable QR labels for crates, bundles, and pallets for seamless warehouse verification.",
    speechText:
      "Generate and print QR code labels for easy yard tracking and delivery verification.",
    side: "top",
  },
  {
    id: "lp-step-qr-row",
    route: "/load_planning/qr-labels",
    element: '[data-tour="qr-labels-row-view"]',
    title: "Load Planning: View QR Labels",
    description:
      "The <b>eye</b> icon opens the labels for that project's packing lists and bundles.",
    speechText: "Use the eye icon to open a project's labels.",
    side: "left",
    locked: true,
  },
];
