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
];
