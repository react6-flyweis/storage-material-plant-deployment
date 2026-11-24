import { anchor, click, enabledAnchor, modal } from "./tour-helpers";

// Bid and delivery modals, shared by several tours.

export const awardModal = modal(
  "award-load-modal",
  click(anchor("bid-award"), "Award a Load", "<b>Award Load</b> asks you to confirm before anything is sent.", true),
);

export const revisionModal = modal(
  "request-revision-modal",
  click(anchor("bid-revision"), "Request a Revision", "<b>Request Revision</b> asks the carrier for a better bid.", true),
);

export const statusModal = modal(
  "delivery-status-modal",
  click(enabledAnchor("delivery-update-status"), "Update the Status", "The <b>Status</b> action moves the delivery to its next stage.", true),
);
