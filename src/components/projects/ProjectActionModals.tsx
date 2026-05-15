import React, { useState } from "react";
import CommonDropdown from "../common_component/CommonDropdown";
import { X } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateStepStatusModal: React.FC<ModalProps & { onUpdate: () => void }> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [status, setStatus] = useState("Production Planning");

  const options = [
    { label: "Production Planning", value: "Production Planning" },
    { label: "Released to plant", value: "Released to plant" },
    { label: "Drawings Received", value: "Drawings Received" },
    { label: "BOM Received", value: "BOM Received" },
    { label: "BOM Review", value: "BOM Review" },
    { label: "Material Request", value: "Material Request" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-[14px] w-full max-w-lg p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <SubHeading text="Update Step Status"/>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <CommonDropdown
            label="Select Current Status"
            options={options}
            value={status}
            onChange={setStatus}
          />

          <div className="flex items-center justify-between gap-4 mt-20">
            <button
              onClick={onClose}
              className="px-10 py-2 bg-white border border-gray-300 text-[#212B36] rounded-sm text-sm sm:text-base font-inter font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              className="px-10 py-2 bg-(--text-color-purple-2) text-white rounded-sm text-sm sm:text-base font-inter font-bold hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddNotesModal: React.FC<ModalProps & { onAdd: () => void }> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("Steel Investment");
  const [note, setNote] = useState("Reliable for long-distance steel transport.\nPreferred carrier for Texas routes.\nFast response time during bidding.");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Notes"
      width="max-w-xl"
    >
      <div className="space-y-6 p-1">
        <CommonInput
          label="Notes Title"
          value={title}
          onChange={setTitle}
          placeholder="Enter note title..."
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#212B36]">Notes</label>
          <textarea
            rows={6}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Additional notes about this project..."
            className="w-full px-4 py-3 bg-white border-[0.7px] border-[#D1D5DC] rounded-xl text-sm text-[#637381] focus:border-[#4A5565] outline-none shadow-xs transition-all resize-none placeholder:text-[#919EAB]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="white"
            onClick={onClose}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={onAdd}
            className="px-8"
          >
            Add Note
          </Button>
        </div>
      </div>
    </Modal>
  );
};