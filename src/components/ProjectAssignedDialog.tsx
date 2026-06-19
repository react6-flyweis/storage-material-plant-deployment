import Modal from "@/components/Modal";
import Button from "@/components/common_component/Button";
import { ClipboardList } from "lucide-react";

interface ProjectAssignedPayload {
  leadId: string;
  poOrderId: string;
  projectName: string;
}

interface ProjectAssignedDialogProps {
  open: boolean;
  onClose: () => void;
  payload: ProjectAssignedPayload | null;
  onViewDetails: () => void;
}

export default function ProjectAssignedDialog({
  open,
  onClose,
  payload,
  onViewDetails,
}: ProjectAssignedDialogProps) {
  if (!payload) return null;

  return (
    <Modal isOpen={open} onClose={onClose} hideHeader={true} width="max-w-md">
      <div className="p-4 text-left">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              New Project Assigned
            </h3>
            <p className="text-sm text-slate-500">
              A new project has been assigned to your plant
            </p>
          </div>
        </div>

        {/* Project Summary Info Card */}
        <div className="mb-5 bg-linear-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100/50">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Project / PO
          </div>
          <h4 className="text-lg font-bold text-slate-900 leading-snug">
            {payload.projectName || "Unknown Project"}
          </h4>
        </div>

        {/* Project Details Grid */}
        {/* <div className="space-y-4 mb-6 text-sm">
          <div className="flex items-start gap-2.5">
            <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-500">PO Order ID</div>
              <div className="font-semibold text-[#212B36] mt-0.5">
                {payload.poOrderId || "N/A"}
              </div>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-28 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50"
          >
            Dismiss
          </Button>
          <Button
            variant="blueFilled"
            onClick={onViewDetails}
            className="w-full sm:w-32 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    </Modal>
  );
}
