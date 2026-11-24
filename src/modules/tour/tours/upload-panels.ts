import { anchor, click, enabledAnchor, modal } from "./tour-helpers";

// The upload modals on a project's details page, shared by several tours.

export const drawingModal = modal(
  "upload-drawing-modal",
  click(
    anchor("project-upload-drawing"),
    "Open Upload Drawing File",
    "<b>Upload Drawing File</b> opens the drawings for every building in this project.",
  ),
);

export const drawingFileDialog = modal(
  "upload-file-modal",
  click(
    enabledAnchor("drawing-upload-file"),
    "Add a Drawing",
    "Each building has its own upload button. Once a building has a drawing the button reads <b>Add another</b>; it is disabled after the drawing is approved.",
    true,
  ),
);

export const bomModal = modal(
  "upload-bom-modal",
  click(
    anchor("project-upload-bom"),
    "Open Upload BOM File",
    "<b>Upload BOM File</b> opens the Bill of Materials status for every building.",
  ),
);

export const bomFileDialog = modal(
  "upload-file-modal",
  click(
    enabledAnchor("bom-upload-file"),
    "Upload a Building's BOM",
    "Use <b>Upload file</b> on a building to add its BOM, or <b>Replace file</b> to send a newer one.",
    true,
  ),
);
