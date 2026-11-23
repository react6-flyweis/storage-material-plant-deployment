import type { TourDefinition, TourStepViaConfig } from "../tour.types";
import { anchor, click, modal, PROJECT_ROUTE as PROJECT } from "./tour-helpers";
import { bomFileDialog, bomModal, drawingFileDialog, drawingModal } from "./upload-panels";

const updateStepModal = modal(
  "update-step-modal",
  click(anchor("project-update-step"), "Update Step Status", "<b>Update Step Status</b> opens the status form."),
  anchor("update-step-close"),
);

const addNoteModal = modal(
  "add-note-modal",
  click(anchor("project-add-note"), "Add Notes", "<b>Add Notes</b> opens the note form."),
);

const addShipperModal = modal(
  "add-shipper-modal",
  click(anchor("shipper-order-add"), "Add a New Shipper", "Not in the list? <b>Add new Shipper</b> lets you add one on the spot.", true),
);

const drawingsPageModal = modal(
  "upload-drawing-modal",
  click(anchor("project-drawings-upload"), "Upload from Here Too", "<b>Upload Drawing</b> opens the same building list."),
);

const drawingPreviewModal = modal(
  "drawing-preview-modal",
  click(anchor("drawing-card-preview"), "Preview a File", "Click the <b>eye</b> icon to preview the file.", true),
);

const materialRequestModal = modal(
  "material-request-modal",
  click(anchor("material-request-row-view"), "View a Request", "Click the <b>eye</b> icon to open a material request.", true),
);

const mismatchTab = {
  element: anchor("mismatch-orders-panel"),
  open: click(anchor("mismatch-orders-tab"), "Open Mismatch Orders", "Switch to the <b>Mismatch Orders</b> tab."),
  close: anchor("material-request-tab"),
};

const mismatchModal = modal(
  "mismatch-modal",
  click(anchor("mismatch-row-view"), "View a Mismatch", "Click the <b>eye</b> icon to open a mismatch.", true),
);

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
  estimatedMinutes: 7,
  requiresProject: true,
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
        openAnyway: true,
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
      id: "pd-drawing-modal",
      route: PROJECT,
      element: anchor("upload-drawing-modal"),
      title: "Building Drawings",
      description:
        "Every building with its latest drawing, version and approval status. A rejected drawing shows the reason.",
      speechText: "Every building is listed with its latest drawing and approval status.",
      panels: [drawingModal],
    },
    {
      id: "pd-drawing-file",
      route: PROJECT,
      element: anchor("upload-file-dropzone"),
      title: "Choose the Drawing",
      description:
        "Drag a file here or browse for it.",
      speechText: "Drag a file here, or browse for it.",
      panels: [drawingModal, drawingFileDialog],
    },
    {
      id: "pd-drawing-submit",
      route: PROJECT,
      element: anchor("upload-file-submit"),
      title: "Upload the Drawing",
      description:
        "Enabled once a file is chosen. The drawing is uploaded and sent to the customer for approval.",
      speechText: "Press upload to send the drawing to the customer for approval.",
      panels: [drawingModal, drawingFileDialog],
    },
    {
      id: "pd-bom-modal",
      route: PROJECT,
      element: anchor("upload-bom-modal"),
      title: "Building BOM Files",
      description:
        "Every building with its BOM status and item count. <b>View and Confirm</b> appears after extraction.",
      speechText: "Every building is listed with the status of its bill of materials.",
      panels: [bomModal],
    },
    {
      id: "pd-bom-file",
      route: PROJECT,
      element: anchor("upload-file-dropzone"),
      title: "Choose the BOM File",
      description:
        "Only <b>.txt</b> and <b>.out</b> files are accepted. Extraction starts right after the upload.",
      speechText: "Choose a text or out file. Extraction starts right after the upload.",
      panels: [bomModal, bomFileDialog],
    },
    {
      id: "pd-bom-consolidate",
      route: PROJECT,
      element: anchor("bom-consolidate"),
      title: "Consolidate",
      description:
        "Once every building is confirmed, <b>Consolidate</b> merges them into one BOM for shipping.",
      speechText: "Once every building is confirmed, consolidate them into one.",
      panels: [bomModal],
      optional: true,
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
      id: "pd-update-step",
      route: PROJECT,
      element: anchor("update-step-modal"),
      title: "Update Step Status",
      description:
        "Choose the new stage and add an optional note. Nothing changes until you submit.",
      speechText: "Choose the new stage and add a note if you like.",
      panels: [updateStepModal],
    },
    {
      id: "pd-add-note",
      route: PROJECT,
      element: anchor("add-note-modal"),
      title: "Add Notes",
      description:
        "Write a note about the project for the rest of the team.",
      speechText: "Write a note about the project for the team.",
      panels: [addNoteModal],
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
      id: "pd-bom-actions",
      route: `${PROJECT}/view-bom`,
      element: anchor("project-bom-actions"),
      title: "BOM Actions",
      description:
        "<b>Download Excel</b> saves the BOM. <b>Share with Shippers</b> sends it out for shipper files.",
      speechText: "Download the bill of materials, or share it with shippers.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
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
    {
      id: "pd-shipper-grid",
      route: `${PROJECT}/generate-shipper-order`,
      element: anchor("shipper-order-grid"),
      title: "Select Shippers",
      description:
        "Click a card to select it. You can choose more than one; shippers already sent the BOM are marked.",
      speechText: "Select one or more shippers.",
      side: "top",
      locked: true,
    },
    {
      id: "pd-shipper-add",
      route: `${PROJECT}/generate-shipper-order`,
      element: anchor("add-shipper-modal"),
      title: "Add a Shipper",
      description:
        "A name, email and phone number are enough to add a shipper here.",
      speechText: "Enter a name, email and phone number to add a shipper.",
      panels: [addShipperModal],
    },
    {
      id: "pd-shipper-send",
      route: `${PROJECT}/generate-shipper-order`,
      element: anchor("shipper-order-send"),
      title: "Send the Order",
      description:
        "<b>Send Order</b> emails the BOM to every selected shipper.",
      speechText: "Send order emails the bill of materials to every selected shipper.",
      side: "bottom",
      align: "end",
      locked: true,
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
    {
      id: "pd-drawing-card",
      route: `${PROJECT}/view-drawings`,
      element: anchor("drawing-card-actions"),
      title: "File Actions",
      description:
        "Download a file, or preview it without leaving the page.",
      speechText: "Download a file, or preview it.",
      side: "top",
      optional: true,
      locked: true,
    },
    {
      id: "pd-drawing-preview",
      route: `${PROJECT}/view-drawings`,
      element: anchor("drawing-preview-modal"),
      title: "Preview",
      description:
        "A larger view of the drawing or photo, with its details.",
      speechText: "Preview the drawing or photo at full size.",
      panels: [drawingPreviewModal],
    },
    {
      id: "pd-drawings-upload",
      route: `${PROJECT}/view-drawings`,
      element: anchor("upload-drawing-modal"),
      title: "Upload a Missing Drawing",
      description:
        "Upload drawings from this page as well as from the project's home page.",
      speechText: "You can upload drawings from this page too.",
      panels: [drawingsPageModal],
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
    {
      id: "pd-delivery-actions",
      route: `${PROJECT}/material-delivery`,
      element: anchor("delivery-reschedule"),
      title: "Reschedule the Delivery",
      description:
        "Move the delivery to a new date. <b>Edit Delivery</b>, next to it, changes everything else.",
      speechText: "Reschedule or edit the delivery from here.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
    },
    {
      id: "pd-delivery-quick",
      route: `${PROJECT}/material-delivery`,
      element: anchor("delivery-quick-actions"),
      title: "Delivery Quick Actions",
      description:
        "Update the status, contact the site, send a reminder or view documents. The Delivery Guide covers each one.",
      speechText: "Quick actions for the delivery are here.",
      side: "left",
      optional: true,
      locked: true,
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
    {
      id: "pd-shipper-file-actions",
      route: `${PROJECT}/shipper-files/:requestId`,
      element: anchor("shipper-file-actions"),
      title: "Shipper File Actions",
      description:
        "Depending on the file's status: download it, run <b>Order Verification</b>, view the comparison, or <b>Start Load Planning</b>.",
      speechText: "The actions here depend on the file's status.",
      side: "bottom",
      align: "end",
      optional: true,
      locked: true,
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
        "Switch between <b>Additional Material Request</b> and <b>Mismatch Orders</b>.",
      speechText:
        "Switch between additional material requests and mismatch orders.",
      side: "bottom",
    },
    {
      id: "pd-material-request",
      route: `${PROJECT}/material-request`,
      element: anchor("material-request-modal"),
      title: "Material Request Details",
      description:
        "The requested items and quantities, with the request's status.",
      speechText: "See the requested items, quantities and status.",
      panels: [materialRequestModal],
    },
    {
      id: "pd-mismatch-tab",
      route: `${PROJECT}/material-request`,
      element: anchor("mismatch-orders-panel"),
      title: "Mismatch Orders",
      description:
        "Items whose quantity in the shipper file did not match your BOM. That covers every page of a project.",
      speechText: "These items did not match your bill of materials. That covers every page of a project.",
      panels: [mismatchTab],
      side: "top",
    },
    {
      id: "pd-mismatch-details",
      route: `${PROJECT}/material-request`,
      element: anchor("mismatch-modal"),
      title: "Mismatch Details",
      description:
        "Expected and received quantities side by side.",
      speechText: "Compare the expected and received quantities.",
      panels: [mismatchTab, mismatchModal],
    },
  ],
};
