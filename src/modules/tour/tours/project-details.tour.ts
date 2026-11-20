import type { TourDefinition, TourStepViaConfig } from "../tour.types";

const PROJECT = "/projects/:projectId";

const quickAction = (label: string, tourId: string): TourStepViaConfig => ({
  fromRoute: PROJECT,
  element: `[data-tour="${tourId}"]`,
  title: `Open ${label}`,
  description: `From the project's quick actions, click <b>${label}</b>. Click it yourself, or press Next and we'll do it for you.`,
  speechText: `Click ${label}.`,
});

/**
 * Deep dive into a single project: every section of the details page and
 * every sub-page reachable from it. Uses the first project in the list.
 */
export const projectDetailsTour: TourDefinition = {
  id: "project-details",
  name: "Project Details Guide",
  description:
    "Every section of a project's details page and each page you can open from it: BOM, drawings, delivery, shipper files and material orders.",
  estimatedMinutes: 4,
  steps: [
    // ── Project details page ────────────────────────────────────────────
    {
      id: "pd-open-project",
      route: PROJECT,
      element: '[data-tour="project-details-header"]',
      title: "Project Details",
      description:
        "This is the project's home page. Everything about one order lives here: customer, buildings, lifecycle, invoices, activity and media.",
      speechText:
        "This is the project details page. Everything about a single order lives here.",
      side: "bottom",
      via: {
        fromRoute: "/projects",
        element: '[data-tour="project-row-view"]',
        title: "Open a Project",
        description:
          "Each row in the projects list has a <b>View</b> (eye) icon. Click it to open that project. Click it yourself, or press Next and we'll do it for you.",
        speechText: "Click the view icon on a project to open it.",
      },
    },
    {
      id: "pd-upload-actions",
      route: PROJECT,
      element: '[data-tour="project-upload-actions"]',
      title: "Upload BOM & Drawings",
      description:
        "Upload the Bill of Materials and the drawings for each building from here. Uploading a BOM starts the automatic part extraction.",
      speechText:
        "Use these buttons to upload the bill of materials and the drawings for each building.",
      side: "bottom",
      align: "end",
    },
    {
      id: "pd-quick-actions",
      route: PROJECT,
      element: '[data-tour="project-quick-actions"]',
      title: "Quick Actions",
      description:
        "Shortcuts to the project's sub-pages: BOM, drawings & photos, material delivery, shipper files and material orders. We'll visit each one after the sections below.",
      speechText:
        "These quick actions open the project's sub-pages. We'll visit each of them shortly.",
      side: "bottom",
    },
    {
      id: "pd-details-card",
      route: PROJECT,
      element: '[data-tour="project-details-card"]',
      title: "Project & Customer Info",
      description:
        "Job ID, building type, number of buildings and quote value, alongside the customer's contact details and site address.",
      speechText:
        "Here you'll find the project specs and the customer's contact details.",
      side: "top",
    },
    {
      id: "pd-lifecycle",
      route: PROJECT,
      element: '[data-tour="project-lifecycle"]',
      title: "Project Lifecycle",
      description:
        "Shows which stage the order is at, from assignment through drawings, BOM, shipping, load planning and delivery, plus what the next step is.",
      speechText:
        "The lifecycle tracker shows the order's current stage and what comes next.",
      side: "top",
    },
    {
      id: "pd-lifecycle-actions",
      route: PROJECT,
      element: '[data-tour="project-lifecycle-actions"]',
      title: "Update the Stage",
      description:
        "Move the project forward with <b>Update Step Status</b> once a stage is complete. Sales and the customer see the change.",
      speechText:
        "Use Update Step Status to move the project to its next stage.",
      side: "top",
      optional: true,
    },
    {
      id: "pd-invoices",
      route: PROJECT,
      element: '[data-tour="project-invoices"]',
      title: "Invoices",
      description:
        "All invoices raised for this project, with their amounts and payment status.",
      speechText: "This table lists every invoice raised for the project.",
      side: "top",
    },
    {
      id: "pd-stats-activity",
      route: PROJECT,
      element: '[data-tour="project-stats-activity"]',
      title: "Progress, Activity & Notes",
      description:
        "Overall progress through the lifecycle, the latest activity on the project, and notes left by the sales team.",
      speechText:
        "Track overall progress, recent activity, and notes from the sales team here.",
      side: "top",
    },
    {
      id: "pd-photos",
      route: PROJECT,
      element: '[data-tour="project-photos"]',
      title: "Photos & Media",
      description:
        "Site and fabrication photos and videos attached to the project. Upload new media to keep everyone up to date.",
      speechText: "Project photos and videos are collected here.",
      side: "top",
    },

    // ── BOM ─────────────────────────────────────────────────────────────
    {
      id: "pd-bom",
      route: `${PROJECT}/view-bom`,
      element: '[data-tour="project-bom-page"]',
      title: "BOM File Details",
      description:
        "The consolidated Bill of Materials for all buildings in this project. Review the extracted items and download them as Excel.",
      speechText:
        "This is the consolidated bill of materials for the whole project.",
      side: "top",
      via: quickAction("View BOM File", "project-action-view-bom"),
    },
    {
      id: "pd-generate-shipper-order",
      route: `${PROJECT}/generate-shipper-order`,
      element: '[data-tour="project-generate-shipper-order-page"]',
      title: "Generate Shipper Order",
      description:
        "Pick the shippers to send the consolidated BOM to. Each shipper replies with a shipper file listing what they will ship.",
      speechText:
        "Choose which shippers receive the bill of materials. Each one replies with a shipper file.",
      side: "top",
      via: {
        fromRoute: `${PROJECT}/view-bom`,
        element: '[data-tour="project-bom-share-shippers"]',
        title: "Share with Shippers",
        description:
          "When the BOM is ready, click <b>Share with Shippers</b> to send it out. Click it yourself, or press Next and we'll do it for you.",
        speechText: "Click Share with Shippers.",
      },
    },

    // ── Drawings ────────────────────────────────────────────────────────
    {
      id: "pd-drawings",
      route: `${PROJECT}/view-drawings`,
      element: '[data-tour="project-drawings-page"]',
      title: "Drawings & Media",
      description:
        "All drawings, photos and videos for each building, with their approval status. Upload missing drawings from here.",
      speechText:
        "Every building's drawings and media are listed here with their approval status.",
      side: "top",
      via: quickAction("View Drawings & Photos", "project-action-view-drawings"),
    },

    // ── Delivery ────────────────────────────────────────────────────────
    {
      id: "pd-material-delivery",
      route: `${PROJECT}/material-delivery`,
      element: '[data-tour="delivery-details-page"]',
      title: "Material Delivery",
      description:
        "Delivery schedule, carrier, driver and site details for this project. Reschedule or edit the delivery once a load has been awarded.",
      speechText:
        "Check, reschedule, or edit the project's material delivery here.",
      side: "top",
      via: quickAction("Material Delivery", "project-action-material-delivery"),
    },

    // ── Shipper files ───────────────────────────────────────────────────
    {
      id: "pd-shipper-files",
      route: `${PROJECT}/shipper-files`,
      element: '[data-tour="project-shipper-files-page"]',
      title: "Shipper Files",
      description:
        "Every shipper file received for this project, with stats, search, filters and each file's review status.",
      speechText:
        "All shipper files received for the project are listed here with their status.",
      side: "top",
      via: quickAction("View Shipper Files", "project-action-shipper-files"),
    },
    {
      id: "pd-shipper-file-details",
      route: `${PROJECT}/shipper-files/:requestId`,
      element: '[data-tour="project-shipper-file-details-page"]',
      title: "Shipper File Details",
      description:
        "Review one shipper file. From here run <b>Order Verification</b> to compare it with your BOM, view the comparison result, and start load planning once it's approved.",
      speechText:
        "Open a shipper file to verify it against your bill of materials and start load planning once approved.",
      side: "top",
      via: {
        fromRoute: `${PROJECT}/shipper-files`,
        element: '[data-tour="project-shipper-file-view"]',
        title: "Open a Shipper File",
        description:
          "Click <b>View</b> on a shipper file to open its details. Click it yourself, or press Next and we'll do it for you.",
        speechText: "Click view on a shipper file.",
      },
    },

    // ── Material orders ─────────────────────────────────────────────────
    {
      id: "pd-material-orders",
      route: `${PROJECT}/material-request`,
      element: '[data-tour="project-material-orders-page"]',
      title: "Material Orders",
      description:
        "Additional material requests raised for this project, and any mismatch orders found during shipper file verification.",
      speechText:
        "Material orders shows additional material requests and mismatch orders for the project.",
      side: "top",
      via: quickAction("Material Orders", "project-action-material-orders"),
    },
    {
      id: "pd-material-orders-tabs",
      route: `${PROJECT}/material-request`,
      element: '[data-tour="project-material-orders-tabs"]',
      title: "Requests vs. Mismatches",
      description:
        "Switch between <b>Additional Material Request</b> and <b>Mismatch Orders</b>. That covers every page of a project.",
      speechText:
        "Switch between additional material requests and mismatch orders. That covers every page of a project.",
      side: "bottom",
    },
  ],
};
