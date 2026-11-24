import type { TourDefinition, TourStepViaConfig } from "../tour.types";
import { anchor, click, enabledAnchor, PROJECT_ROUTE } from "./tour-helpers";
import { bomFileDialog, bomModal, drawingFileDialog, drawingModal } from "./upload-panels";
import { awardModal, revisionModal, statusModal } from "./delivery-panels";

const BOM_DETAILS = "/costing/bom-details/:id";
const SHIPPER_FILES = `${PROJECT_ROUTE}/shipper-files`;
const SHIPPER_FILE = `${SHIPPER_FILES}/:requestId`;
const COMPARISON = "/load_planning/:requestId/comparison-result";
const LOAD_PLANS = "/load_planning/list";
const WIZARD = "/load_planning/:planProjectId";
const FREIGHT_LOADS = "/delivery/freight-loads";
const FREIGHT_REQUEST = "/delivery/freight-request/:projectId";
const ALL_DELIVERIES = "/delivery/all-deliveries";
const DELIVERY = "/delivery/delivery-details/:id";

const openProject: TourStepViaConfig = {
  fromRoute: "/projects",
  openAnyway: true,
  ...click(anchor("project-row-view"), "Open the Project", "Click the <b>View</b> (eye) icon to open the project."),
};

// These wizard buttons only move to the next page; the ones that generate or
// confirm a plan are explained but never clicked.
const wizardNext = (fromPage: string, label: string): TourStepViaConfig => ({
  fromRoute: `${WIZARD}/${fromPage}`,
  ...click(anchor("wizard-next"), label, `<b>${label}</b> moves on to the next stage.`),
});

const NO_PROJECT = "You'll see this once a project is assigned to your plant.";
const NO_BOM = "You'll see this once the project has a BOM with its parts extracted.";
const NO_CONSOLIDATED_BOM = "You'll see this once the project's BOM is consolidated.";
const NO_SHIPPER_FILE = "You'll see this once a shipper file has been received.";
const NO_LOAD_PLAN = "You'll see this once a load plan has been started.";
const NO_FREIGHT = "You'll see this once a load has been sent out for bids.";
const NO_DELIVERY = "You'll see this once a delivery has been created.";

/**
 * Walks one order from assignment to delivery, through every page and modal
 * along the way. Each stage uses the first record that has reached it; a stage
 * with no records yet is still explained, so the flow is never cut short.
 */
export const orderFlowTour: TourDefinition = {
  id: "order-flow",
  name: "Order Flow Guide",
  description:
    "The complete order flow, from project assignment to delivery: drawings, BOM, shippers, load planning, bids and dispatch.",
  estimatedMinutes: 8,
  steps: [
    // ── 1. Project assigned ─────────────────────────────────────────────
    {
      id: "flow-1-assigned",
      route: "/projects",
      element: anchor("projects-tab"),
      title: "Step 1 · Project Assigned",
      description:
        "Every order starts when sales releases a project to your plant. You'll get a notification and the project appears in this list.",
      speechText:
        "Every order starts when a project is assigned to your plant. It appears here, and you'll get a notification.",
      side: "top",
    },
    {
      id: "flow-1-project",
      route: PROJECT_ROUTE,
      element: anchor("project-lifecycle"),
      title: "Step 1 · Follow the Order",
      description:
        "The project's page shows which stage the order has reached and what comes next. The first steps all happen here.",
      speechText: "The project's page shows which stage the order has reached. The first steps all happen here.",
      side: "top",
      locked: true,
      via: openProject,
      whenMissing: NO_PROJECT,
    },

    // ── 2. Drawings ─────────────────────────────────────────────────────
    {
      id: "flow-2-drawings",
      route: PROJECT_ROUTE,
      element: anchor("upload-drawing-modal"),
      panels: [drawingModal],
      title: "Step 2 · Upload Drawings",
      description:
        "Every building needs its drawings. Each one is listed with its latest version and approval status; a rejected drawing shows the reason.",
      speechText: "Every building needs its drawings. Each is listed with its version and approval status.",
      whenMissing: NO_PROJECT,
    },
    {
      id: "flow-2-drawing-file",
      route: PROJECT_ROUTE,
      element: anchor("upload-file-modal"),
      panels: [drawingModal, drawingFileDialog],
      title: "Step 2 · Add the Drawing",
      description:
        "Drop a file here or browse for it, then press <b>Upload</b>. The drawing is sent to the customer for approval.",
      speechText: "Drop a file or browse for it, then press upload. The customer is asked to approve it.",
      whenMissing: "Available until the building's drawing is approved.",
    },

    // ── 3. BOM upload ───────────────────────────────────────────────────
    {
      id: "flow-3-bom",
      route: PROJECT_ROUTE,
      element: anchor("upload-bom-modal"),
      panels: [bomModal],
      title: "Step 3 · Upload the BOM",
      description:
        "Next come the Bills of Materials, one per building. The badge shows whether each has been extracted or confirmed.",
      speechText: "Next, upload a bill of materials for each building.",
      whenMissing: NO_PROJECT,
    },
    {
      id: "flow-3-bom-file",
      route: PROJECT_ROUTE,
      element: anchor("upload-file-modal"),
      panels: [bomModal, bomFileDialog],
      title: "Step 3 · Add the BOM File",
      description:
        "BOM files must be <b>.txt</b> or <b>.out</b>. Parts are extracted automatically after the upload.",
      speechText: "Upload a text or out file. The parts are extracted automatically.",
      whenMissing: "Available until the building's BOM is locked.",
    },

    // ── 4. Review & confirm the BOM ─────────────────────────────────────
    {
      id: "flow-4-bom-details",
      route: BOM_DETAILS,
      element: anchor("bom-file-details-page"),
      title: "Step 4 · Check the Parts",
      description:
        "Once its parts are extracted, review the building's BOM here, with weights and prices.",
      speechText: "Once its parts are extracted, review the building's bill of materials here.",
      side: "top",
      locked: true,
      via: {
        fromRoute: PROJECT_ROUTE,
        panels: [bomModal],
        ...click(
          enabledAnchor("bom-view-file"),
          "View the BOM",
          "In the same window, click <b>View</b> (or <b>View and Confirm</b>) next to the building's BOM.",
          true,
        ),
      },
      whenMissing: NO_BOM,
    },
    {
      id: "flow-4-bom-pricing",
      route: BOM_DETAILS,
      element: anchor("bom-file-pricing"),
      title: "Step 4 · Price Missing Items",
      description:
        "Every item needs a price before the BOM can be confirmed. When some are missing, <b>Add Item in Cost List</b> appears here.",
      speechText: "Every item needs a price before the bill of materials can be confirmed.",
      side: "left",
      locked: true,
      whenMissing: NO_BOM,
    },
    {
      id: "flow-4-bom-confirm",
      route: BOM_DETAILS,
      element: anchor("bom-file-confirm"),
      title: "Step 4 · Confirm the BOM",
      description: "<b>Confirm BOM</b> locks in this building. Repeat for every building in the project.",
      speechText: "Confirm the bill of materials, and repeat for every building.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
      whenMissing: "Shown on BOMs that haven't been confirmed yet.",
    },

    // ── 5. Consolidate ──────────────────────────────────────────────────
    {
      id: "flow-5-consolidate",
      route: PROJECT_ROUTE,
      element: anchor("bom-consolidate"),
      panels: [bomModal],
      title: "Step 5 · Consolidate the BOM",
      description:
        "Back in the project's BOM files, <b>Consolidate</b> merges every building into one material list.",
      speechText: "When all buildings are confirmed, consolidate them into a single bill of materials.",
      via: {
        fromRoute: BOM_DETAILS,
        ...click(anchor("bom-file-back"), "Back to the Project", "Click <b>Back</b> to return to the project."),
      },
      whenMissing: "The button appears once every building's BOM is confirmed.",
    },
    {
      id: "flow-5-consolidated",
      route: `${PROJECT_ROUTE}/view-bom`,
      element: anchor("project-bom-page"),
      title: "Step 5 · The Consolidated BOM",
      description: "The single material list for the whole project. Download it as Excel or send it to shippers.",
      speechText: "This is the single material list for the whole project.",
      side: "top",
      locked: true,
      via: {
        fromRoute: PROJECT_ROUTE,
        ...click(anchor("project-action-view-bom"), "Open View BOM File", "Click <b>View BOM File</b> in the project's quick actions."),
      },
      whenMissing: NO_CONSOLIDATED_BOM,
    },

    // ── 6. Send to shippers ─────────────────────────────────────────────
    {
      id: "flow-6-select-shippers",
      route: `${PROJECT_ROUTE}/generate-shipper-order`,
      element: anchor("shipper-order-grid"),
      title: "Step 6 · Choose Shippers",
      description: "Select one or more shippers. Any that already have the BOM are marked.",
      speechText: "Select the shippers who should receive the bill of materials.",
      side: "top",
      locked: true,
      via: {
        fromRoute: `${PROJECT_ROUTE}/view-bom`,
        ...click(anchor("project-bom-share-shippers"), "Share with Shippers", "Click <b>Share with Shippers</b> to send the BOM out.", true),
      },
      whenMissing: NO_CONSOLIDATED_BOM,
    },
    {
      id: "flow-6-send",
      route: `${PROJECT_ROUTE}/generate-shipper-order`,
      element: anchor("shipper-order-send"),
      title: "Step 6 · Send the Order",
      description:
        "<b>Send Order</b> sends the BOM to every selected shipper. Each one prepares a shipper file listing what they will ship.",
      speechText: "Send order sends the bill of materials to every selected shipper.",
      side: "bottom",
      align: "end",
      locked: true,
      whenMissing: NO_CONSOLIDATED_BOM,
    },

    // ── 7. Receive the shipper file ─────────────────────────────────────
    {
      id: "flow-7-shipper-files",
      route: SHIPPER_FILES,
      element: anchor("project-shipper-files-page"),
      title: "Step 7 · Receive Shipper Files",
      description:
        "Shippers reply in their own time, and you're notified as each file arrives. Every file received for the project is listed here with its review status.",
      speechText:
        "Shippers reply in their own time. You'll get a notification as each file arrives, and it is listed here.",
      side: "top",
      locked: true,
      via: {
        fromRoute: PROJECT_ROUTE,
        ...click(anchor("project-action-shipper-files"), "Open View Shipper Files", "Click <b>View Shipper Files</b> in the project's quick actions."),
      },
      whenMissing: NO_SHIPPER_FILE,
    },
    {
      id: "flow-7-shipper-file",
      route: SHIPPER_FILE,
      element: anchor("project-shipper-file-details-page"),
      title: "Step 7 · Open a Shipper File",
      description: "Review what the shipper says they will send. The buttons at the top depend on the file's status.",
      speechText: "Review what the shipper says they will send.",
      side: "top",
      locked: true,
      via: {
        fromRoute: SHIPPER_FILES,
        ...click(anchor("project-shipper-file-view"), "Open a Shipper File", "Click the <b>eye</b> button on a file to open it."),
      },
      whenMissing: NO_SHIPPER_FILE,
    },

    // ── 8. Verify & compare ─────────────────────────────────────────────
    {
      id: "flow-8-verify",
      route: `${SHIPPER_FILE}/order-verification`,
      element: anchor("order-verification-card"),
      title: "Step 8 · Order Verification",
      description:
        "Your consolidated BOM and the shipper file, side by side. <b>Compare Files</b> starts checking them against each other.",
      speechText: "Compare the shipper file with your bill of materials.",
      side: "top",
      locked: true,
      via: {
        fromRoute: SHIPPER_FILE,
        openAnyway: true,
        ...click(anchor("shipper-file-verify"), "Order Verification", "On a new shipper file, <b>Order Verification</b> starts the check.", true),
      },
      whenMissing: NO_SHIPPER_FILE,
    },
    {
      id: "flow-8-result",
      route: COMPARISON,
      element: anchor("comparison-stats"),
      title: "Step 8 · Comparison Result",
      description:
        "See how many items match, differ or are missing. Click a card to list just those items.",
      speechText: "See how many items match, differ, or are missing.",
      side: "bottom",
      locked: true,
      via: {
        fromRoute: SHIPPER_FILE,
        ...click(anchor("shipper-file-comparison"), "View the Comparison", "<b>View Comparison Detail</b> opens the result.", true),
      },
      whenMissing: "You'll see this once a shipper file has been compared.",
    },
    {
      id: "flow-8-decide",
      route: COMPARISON,
      element: anchor("comparison-actions"),
      title: "Step 8 · Approve or Resubmit",
      description:
        "If everything matches, <b>Approve Shipment</b>. If not, <b>Request Resubmit</b> asks the shipper for a corrected file.",
      speechText: "Approve the file if it matches, or ask the shipper to resubmit it.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
      whenMissing: "These buttons are shown while a comparison is waiting for your decision.",
    },
    {
      id: "flow-8-start-planning",
      route: SHIPPER_FILE,
      element: anchor("shipper-file-start-planning"),
      title: "Step 8 · Start Load Planning",
      description: "Once a shipper file is approved, <b>Start Load Planning</b> appears on it.",
      speechText: "Once a shipper file is approved, you can start load planning.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
      whenMissing: "Shown once a shipper file is approved.",
    },

    // ── 9. Load planning ────────────────────────────────────────────────
    {
      id: "flow-9-plans",
      route: LOAD_PLANS,
      element: anchor("load-planning-page"),
      title: "Step 9 · Plan the Loads",
      description: "Every project with a load plan. We'll use one of them to walk through the planning stages.",
      speechText: "Next comes load planning. We'll walk through its stages.",
      side: "top",
    },
    {
      id: "flow-9-plan",
      route: "/load_planning/details/:planProjectId",
      element: anchor("load-plan-summary"),
      title: "Step 9 · A Load Plan",
      description: "The plan's bundles, loads and weight.",
      speechText: "The plan summarizes the bundles, loads and weight.",
      side: "bottom",
      via: {
        fromRoute: LOAD_PLANS,
        ...click(anchor("load-plan-row-view"), "Open a Load Plan", "Click the <b>eye</b> icon to open a load plan.", true),
      },
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-stages",
      route: `${WIZARD}/item-analysis`,
      element: anchor("load-plan-stepper"),
      title: "Step 9 · The Planning Stages",
      description:
        "Planning has seven stages, from item analysis to the freight request. This bar shows where you are.",
      speechText: "Planning has seven stages. This bar shows where you are.",
      side: "bottom",
      locked: true,
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-items",
      route: `${WIZARD}/item-analysis`,
      element: anchor("wizard-item-analysis"),
      title: "Step 9 · Item Analysis",
      description:
        "Check the approved shipper file, then <b>Auto Optimize Bundles</b> groups its items into bundles.",
      speechText: "Check the approved file, then let the system group its items into bundles.",
      side: "bottom",
      locked: true,
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-bundles",
      route: `${WIZARD}/bundle-planner`,
      element: anchor("wizard-bundles"),
      title: "Step 9 · Bundle Planner",
      description: "Every bundle, with its items, length and weight.",
      speechText: "Review every bundle, with its items, length and weight.",
      side: "top",
      locked: true,
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-bundle-actions",
      route: `${WIZARD}/bundle-planner`,
      element: anchor("wizard-bundle-row-actions"),
      title: "Step 9 · Adjust a Bundle",
      description: "<b>Edit Bundle</b> changes what's inside. <b>View QR</b> shows its label.",
      speechText: "Edit a bundle's contents, or view its label.",
      side: "left",
      locked: true,
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-bundle-confirm",
      route: `${WIZARD}/bundle-planner`,
      element: anchor("load-plan-actions"),
      title: "Step 9 · Confirm the Bundles",
      description:
        "<b>Confirm Bundle Plan</b> locks the bundles, then <b>Proceed to Truckload Optimization</b> assigns them to trucks.",
      speechText: "Confirm the bundle plan, then proceed to truckload optimization.",
      side: "bottom",
      align: "end",
      locked: true,
      whenMissing: NO_LOAD_PLAN,
    },
    {
      id: "flow-9-trucks",
      route: `${WIZARD}/truck-optimizer`,
      element: anchor("wizard-trucks"),
      title: "Step 9 · Truckload Optimizer",
      description:
        "How the bundles fill each truck. <b>Generate Packing List</b>, above, confirms the plan.",
      speechText: "See how the bundles fill each truck, then generate the packing lists.",
      side: "top",
      locked: true,
      whenMissing: "You'll see this once the bundles are confirmed.",
    },
    {
      id: "flow-9-packing",
      route: `${WIZARD}/packing-list`,
      element: anchor("wizard-packing-lists"),
      title: "Step 9 · Packing Lists",
      description: "One packing list per truck. View or download each one.",
      speechText: "Each truck gets its own packing list.",
      side: "top",
      locked: true,
      whenMissing: "You'll see this once the truck plan is confirmed.",
    },
    {
      id: "flow-9-labels",
      route: `${WIZARD}/qr-label`,
      element: anchor("wizard-qr-labels"),
      title: "Step 9 · QR Labels",
      description: "View and print the labels used to scan loads in the yard.",
      speechText: "View and print the labels used to scan loads in the yard.",
      side: "top",
      locked: true,
      via: wizardNext("packing-list", "Generate QR Label"),
      whenMissing: "You'll see this once the truck plan is confirmed.",
    },
    {
      id: "flow-9-review",
      route: `${WIZARD}/load-plan-review`,
      element: anchor("wizard-review"),
      title: "Step 9 · Load Plan Review",
      description: "A final check of bundles, trucks and weights before asking carriers for prices.",
      speechText: "Make a final check before asking carriers for prices.",
      side: "top",
      locked: true,
      via: wizardNext("qr-label", "Review Load Plan"),
      whenMissing: "You'll see this once the truck plan is confirmed.",
    },

    // ── 10. Freight bids ────────────────────────────────────────────────
    {
      id: "flow-10-request",
      route: `${WIZARD}/freight-selection`,
      element: anchor("wizard-freight"),
      title: "Step 10 · Create a Freight Request",
      description:
        "Fill in the load's details and choose carriers. If bids were already requested for this project, they're shown here instead.",
      speechText: "Fill in the load's details and choose carriers to bid on it.",
      side: "top",
      locked: true,
      via: wizardNext("load-plan-review", "Approve & Create Freight Request"),
      whenMissing: "You'll see this once the load plan is reviewed.",
    },
    {
      id: "flow-10-carriers",
      route: `${WIZARD}/freight-selection`,
      element: anchor("wizard-carriers"),
      title: "Step 10 · Select Carriers",
      description: "Pick the carriers who should bid. Choose as many as you like.",
      speechText: "Pick the carriers who should bid.",
      side: "left",
      optional: true,
      locked: true,
      whenMissing: "Shown when you set up a new freight request for the project.",
    },
    {
      id: "flow-10-send",
      route: `${WIZARD}/freight-selection`,
      element: anchor("wizard-send-carriers"),
      title: "Step 10 · Send for Bids",
      description: "<b>Send to Carriers</b> asks them for a price. <b>Save as Draft</b> keeps the request for later.",
      speechText: "Send the request to the carriers, or save it as a draft.",
      side: "left",
      optional: true,
      locked: true,
      whenMissing: "Shown when you set up a new freight request for the project.",
    },
    {
      id: "flow-10-loads",
      route: FREIGHT_LOADS,
      element: anchor("freight-loads-page"),
      title: "Step 10 · Follow the Bids",
      description: "Every load sent out for bids, with its route, dates and status.",
      speechText: "Loads sent out for bids are listed here.",
      side: "top",
    },

    // ── 11. Award ───────────────────────────────────────────────────────
    {
      id: "flow-11-compare",
      route: FREIGHT_REQUEST,
      element: anchor("freight-request-bids"),
      title: "Step 11 · Compare Bids",
      description: "Bids are ranked by price, with the lowest highlighted in green.",
      speechText: "Bids are ranked by price, with the lowest highlighted.",
      side: "top",
      locked: true,
      via: {
        fromRoute: FREIGHT_LOADS,
        ...click(anchor("freight-load-row-view"), "View a Load", "Click <b>View</b> to see the load's bids.", true),
      },
      whenMissing: NO_FREIGHT,
    },
    {
      id: "flow-11-revision",
      route: FREIGHT_REQUEST,
      element: anchor("request-revision-modal"),
      panels: [revisionModal],
      title: "Step 11 · Ask for a Better Bid",
      description: "Enter a target amount and a message to ask the carrier for a new bid.",
      speechText: "You can ask the carrier for a better bid.",
      whenMissing: "Available on bids that are still open.",
    },
    {
      id: "flow-11-award",
      route: FREIGHT_REQUEST,
      element: anchor("award-load-modal"),
      panels: [awardModal],
      title: "Step 11 · Award the Load",
      description: "Check the carrier and amount, then confirm. Nothing is awarded until you do.",
      speechText: "Check the carrier and amount, then confirm the award.",
      whenMissing: "Available on bids that are still open.",
    },
    {
      id: "flow-11-awarded",
      route: "/delivery/awarded-loads",
      element: anchor("awarded-loads-page"),
      title: "Step 11 · Awarded Loads",
      description: "Loads that have a carrier, with the agreed price, ready for dispatch.",
      speechText: "Awarded loads are listed here, ready for dispatch.",
      side: "top",
    },

    // ── 12. Delivery ────────────────────────────────────────────────────
    {
      id: "flow-12-deliveries",
      route: ALL_DELIVERIES,
      element: anchor("all-deliveries-page"),
      title: "Step 12 · Dispatch & Delivery",
      description: "Follow every delivery from here until it reaches the site.",
      speechText: "Follow every delivery until it reaches the site.",
      side: "top",
    },
    {
      id: "flow-12-delivery",
      route: DELIVERY,
      element: anchor("delivery-quick-actions"),
      title: "Step 12 · Manage the Delivery",
      description: "Reschedule, contact the site, send a reminder or view the documents.",
      speechText: "Reschedule, contact the site, send a reminder, or view the documents.",
      side: "left",
      locked: true,
      via: {
        fromRoute: ALL_DELIVERIES,
        ...click(anchor("all-deliveries-row"), "Open a Delivery", "Click a row to open that delivery.", true),
      },
      whenMissing: NO_DELIVERY,
    },
    {
      id: "flow-12-status",
      route: DELIVERY,
      element: anchor("delivery-status-modal"),
      panels: [statusModal],
      title: "Step 12 · Update the Status",
      description:
        "Move the delivery through its stages until it is delivered. That completes the order.",
      speechText: "Update the status until it is delivered. That completes the order.",
      whenMissing: "Available while a delivery is still in progress.",
    },
  ],
};
