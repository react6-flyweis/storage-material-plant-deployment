import type { TourDefinition } from "../tour.types";

/**
 * Explains the end-to-end order flow in one sitting, using the list pages
 * that exist without a project selected. It does not track any real project.
 */
export const orderFlowTour: TourDefinition = {
  id: "order-flow",
  name: "Order Flow Guide",
  description:
    "From project assignment to awarding a freight load: the 10 stages every order goes through.",
  estimatedMinutes: 3,
  steps: [
    {
      id: "flow-step-1-assigned",
      route: "/projects",
      element: '[data-tour="projects-tab"]',
      title: "Step 1 · Project Assigned",
      description:
        "Every order starts when sales releases a project to your plant. You'll get a notification and the project appears in this list. Open it to see its buildings and work through the steps.",
      speechText:
        "Every order starts when a project is assigned to your plant. It appears here, and you'll get a notification.",
      side: "top",
    },
    {
      id: "flow-step-2-drawing",
      route: "/projects",
      element: '[data-tour="projects-tab"]',
      title: "Step 2 · Upload Drawings",
      description:
        "Open the project and use Upload Drawing to attach the drawings for each building. Each building's drawings must be uploaded before you move on to the BOM.",
      speechText:
        "Next, open the project and upload the drawings for each building.",
      side: "top",
      branch: {
        tourId: "project-details",
        label: "Explore Project Details (4 min)",
        description:
          "Want a full walkthrough of a project's details page and every page you can open from it?",
      },
    },
    {
      id: "flow-step-3-bom",
      route: "/load_planning/uploaded-bom-files",
      element: '[data-tour="uploaded-bom-files-page"]',
      title: "Step 3 · Upload the BOM",
      description:
        "Upload the Bill of Materials for each building. The system extracts the parts automatically. Review the extracted items and confirm the BOM for every building.",
      speechText:
        "Then upload the bill of materials for each building, review the extracted parts, and confirm them.",
      side: "top",
    },
    {
      id: "flow-step-4-consolidate",
      route: "/load_planning/uploaded-bom-files",
      element: '[data-tour="uploaded-bom-files-page"]',
      title: "Step 4 · Consolidate the BOM",
      description:
        "Once every building's BOM is confirmed, generate the consolidated BOM. For projects with multiple buildings, this merges them into one material list for shipping.",
      speechText:
        "When all buildings are confirmed, consolidate them into a single bill of materials.",
      side: "top",
    },
    {
      id: "flow-step-5-send-shipper",
      route: "/load_planning/shipper-quotation",
      element: '[data-tour="shipper-quotation-page"]',
      title: "Step 5 · Send to Shipper",
      description:
        "Send the consolidated BOM to your shippers. Each shipper prepares a shipper file listing what they will ship against your BOM.",
      speechText:
        "Send the consolidated bill of materials to your shippers.",
      side: "top",
    },
    {
      id: "flow-step-6-shipper-file",
      route: "/load_planning/shipper-quotation",
      element: '[data-tour="shipper-quotation-page"]',
      title: "Step 6 · Receive the Shipper File",
      description:
        "Shippers respond in their own time. You'll be notified as each shipper file arrives, and this page shows which projects have received all, some, or none of their files.",
      speechText:
        "Shippers reply in their own time. You'll get a notification when each shipper file arrives.",
      side: "top",
    },
    {
      id: "flow-step-7-compare",
      route: "/load_planning/shipper-quotation",
      element: '[data-tour="shipper-quotation-page"]',
      title: "Step 7 · Compare & Check the Result",
      description:
        "Run the comparison to check the shipper file against your BOM. Review the result: approve it if it matches, or request a resubmission if items are missing or wrong.",
      speechText:
        "Compare each shipper file against your bill of materials, then approve it or ask for a resubmission.",
      side: "top",
    },
    {
      id: "flow-step-8-load-planning",
      route: "/load_planning/list",
      element: '[data-tour="load-planning-page"]',
      title: "Step 8 · Plan the Loads",
      description:
        "With an approved shipper file, start load planning: analyse the items, build bundles, optimise trucks, then generate packing lists and QR labels.",
      speechText:
        "With an approved file, start load planning. Build bundles, optimise trucks, and generate packing lists and labels.",
      side: "top",
    },
    {
      id: "flow-step-9-bids",
      route: "/delivery/freight-loads",
      element: '[data-tour="freight-loads-page"]',
      title: "Step 9 · Send Loads for Bids",
      description:
        "At the end of load planning, choose freight carriers and send the loads out for bids. Carrier bids appear here as they come in.",
      speechText:
        "Send the planned loads to freight carriers for bids. Bids show up here as carriers respond.",
      side: "top",
    },
    {
      id: "flow-step-10-award",
      route: "/delivery/awarded-loads",
      element: '[data-tour="awarded-loads-page"]',
      title: "Step 10 · Award the Load",
      description:
        "Compare the carrier bids and award the load to the best one, or ask a carrier to revise its bid. Awarded loads are listed here and move on to dispatch and delivery.",
      speechText:
        "Finally, pick the best bid and award the load. Awarded loads are listed here, ready for dispatch.",
      side: "top",
    },
  ],
};
