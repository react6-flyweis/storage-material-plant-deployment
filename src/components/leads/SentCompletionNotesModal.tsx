import React, { useState } from "react";
import Modal from "../Modal";

interface SentCompletionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

const SentCompletionNotesModal: React.FC<SentCompletionNotesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(note);
    setNote("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sent Completion Notes"
      width="max-w-xl"
    >
      <div className="p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2 font-primary">
          Add Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter completion notes here..."
          className="w-full h-40 p-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-medium"
        />

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SentCompletionNotesModal;
