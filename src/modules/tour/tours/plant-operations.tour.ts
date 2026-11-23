import type { TourDefinition, TourPanelConfig } from "../tour.types";
import { anchor, click, modal } from "./tour-helpers";
import { dashboardSteps } from "./dashboard.tour";
import { loadPlanningSteps } from "./load-planning.tour";
import { deliverySteps } from "./delivery.tour";

const directChatsTab: TourPanelConfig = {
  element: anchor("chat-new-direct"),
  open: click(anchor("chat-direct-tab"), "Open Direct Chats", "Switch to <b>Direct</b> for one-to-one chats."),
  close: anchor("chat-groups-tab"),
};

const newChatModal = modal(
  "new-chat-modal",
  click(anchor("chat-new-direct"), "Start a Chat", "<b>New Direct Chat</b> lets you pick a team member."),
  anchor("new-chat-close"),
);

export const plantOperationsTour: TourDefinition = {
  id: "plant-operations",
  name: "Plant Operations & Collaboration Tour",
  description:
    "Complete walkthrough covering dashboard, projects, load planning, delivery, costing, logistics, and team communication.",
  estimatedMinutes: 8,
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
        label: "Explore Project Details (7 min)",
        description:
          "Want a full walkthrough of a project's details page and every page you can open from it?",
      },
    },
    {
      id: "step-project-row-view",
      route: "/projects",
      element: '[data-tour="project-row-view"]',
      title: "Projects: View",
      description:
        "The <b>eye</b> icon opens the project: its buildings, drawings, BOM, lifecycle and deliveries.",
      speechText: "Use the eye icon to open a project.",
      side: "left",
      locked: true,
    },
    {
      id: "step-project-row-chat",
      route: "/projects",
      element: '[data-tour="project-row-chat"]',
      title: "Projects: Chat",
      description:
        "<b>Chat</b> takes you to the communication center to talk with the team.",
      speechText: "Chat takes you to the communication center.",
      side: "left",
      locked: true,
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
      id: "step-costing-add",
      route: "/costing",
      element: '[data-tour="costing-add-part"]',
      title: "Costing: Add a Part",
      description:
        "Adds a new part with its category, unit and costs.",
      speechText: "Add a new part cost from here.",
      side: "bottom",
      locked: true,
    },
    {
      id: "step-costing-edit",
      route: "/costing",
      element: '[data-tour="costing-row-edit"]',
      title: "Costing: Edit a Part",
      description:
        "Every row has an <b>Edit</b> button to update that part's costs.",
      speechText: "Every row has an edit button.",
      side: "left",
      locked: true,
    },
    {
      id: "step-logistics",
      route: "/logistics/shippers",
      element: '[data-tour="logistics-tab"]',
      title: "Logistics: Shippers",
      description:
        "Every shipper your plant works with, with their materials, orders, status and pickup location.",
      speechText: "This is your list of shippers.",
      side: "top",
    },
    {
      id: "step-shipper-details",
      route: "/logistics/vendor/:id",
      element: anchor("shipper-details-profile"),
      title: "Shippers: Details",
      description:
        "The shipper's profile. Their order history, compliance documents, notes and contacts are on this page too.",
      speechText: "The details page shows a shipper's profile, orders and documents.",
      side: "bottom",
      locked: true,
      via: {
        fromRoute: "/logistics/shippers",
        ...click(anchor("shipper-row-view"), "View a Shipper", "Click the <b>eye</b> icon to open this shipper.", true),
      },
    },
    {
      id: "step-shipper-add",
      route: "/logistics/shippers/add",
      element: anchor("shipper-form-info"),
      title: "Shippers: Add",
      description:
        "Fill in the shipper's information, then their address, materials and documents below. Fields marked <b>*</b> are required. <b>Add Shipper</b> at the top right saves it.",
      speechText: "Fill in this form to add a new shipper.",
      side: "top",
      locked: true,
      via: {
        fromRoute: "/logistics/shippers",
        ...click(anchor("shipper-add"), "Add a Shipper", "Click <b>Add Vendor</b> to register a new shipper."),
      },
    },
    {
      id: "step-carriers",
      route: "/logistics/freight-carriers",
      element: anchor("carriers-page"),
      title: "Logistics: Freight Carriers",
      description:
        "The carriers who bid on your loads, with their bids, win rate and equipment.",
      speechText: "These are the carriers who bid on your loads.",
      side: "top",
    },
    {
      id: "step-carrier-details",
      route: "/logistics/carrier/:id",
      element: anchor("carrier-details-profile"),
      title: "Carriers: Details",
      description:
        "The carrier's profile and fleet. Their projects, freight history and compliance documents are further down.",
      speechText: "The details page shows a carrier's profile, fleet and history.",
      side: "bottom",
      locked: true,
      via: {
        fromRoute: "/logistics/freight-carriers",
        ...click(anchor("carrier-row-view"), "View a Carrier", "Click the <b>eye</b> icon to open this carrier.", true),
      },
    },
    {
      id: "step-carrier-add",
      route: "/logistics/freight-carriers/add",
      element: anchor("carrier-form-info"),
      title: "Carriers: Add",
      description:
        "Fill in the carrier's information, then their address, fleet, capacity and documents below. Fields marked <b>*</b> are required. <b>Add Freight Courier</b> at the top right saves it.",
      speechText: "Fill in this form to add a new carrier.",
      side: "top",
      locked: true,
      via: {
        fromRoute: "/logistics/freight-carriers",
        ...click(anchor("carrier-add"), "Add a Carrier", "Click <b>Add Carrier</b> to register a new freight carrier."),
      },
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
      id: "step-chat-tabs",
      route: "/communication",
      element: '[data-tour="chat-tabs"]',
      title: "Communication: Groups & Direct",
      description:
        "Switch between <b>Groups</b> and <b>Direct</b> chats.",
      speechText: "Switch between group and direct chats.",
      side: "right",
      locked: true,
    },
    {
      id: "step-chat-new",
      route: "/communication",
      element: anchor("new-chat-modal"),
      title: "Communication: New Chat",
      description:
        "Search for a team member and select them to start a chat.",
      speechText: "Search for a team member to start a chat.",
      panels: [directChatsTab, newChatModal],
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
      id: "step-notification-row",
      route: "/notification",
      element: '[data-tour="notification-row-actions"]',
      title: "Notifications: Row Actions",
      description:
        "Mark a notification as read, or delete it. Click the notification itself to open what it is about.",
      speechText: "Mark a notification as read, or delete it.",
      side: "left",
      locked: true,
      optional: true,
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
