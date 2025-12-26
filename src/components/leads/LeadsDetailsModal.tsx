import React from "react";
import { mockLeadsData } from "../../data/mockData";

interface LeadsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadsDetailsModal: React.FC<LeadsDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const {
    id,
    contactInfo,
    projectDetails,
    assignment,
    contract,
    progress,
    recentActivity,
    photos,
  } = mockLeadsData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Leads Details - {contactInfo.fullName}
            </h2>
            <p className="text-sm text-gray-500">{id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              Open Chat
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
              Track Order Lifecycle
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
              Drawings & Images
            </button>
          </div>

          {/* Contact & Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {contactInfo.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Email
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {contactInfo.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Phone
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {contactInfo.phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Location
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {contactInfo.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">
                Project Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Building Type
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {projectDetails.buildingType}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Quote Value
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {projectDetails.quoteValue}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Status
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-[#EA580C]">
                    {projectDetails.status}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Created On
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {projectDetails.createdOn}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignment Card */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Assignment
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={assignment.avatar}
                  alt={assignment.assignedTo}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Assigned to: {assignment.assignedTo}
                  </p>
                  <p className="text-xs text-gray-500">{assignment.role}</p>
                </div>
              </div>
            </div>

            {/* Contract Card */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Signed Contract/Agreement
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {contract.status}
                  </p>
                  <p className="text-xs text-gray-500">{contract.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              Progress Steps
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

                {progress.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 
                      ${
                        step.status === "completed"
                          ? "bg-[#22C55E] text-white"
                          : step.status === "current"
                          ? "bg-[#3B82F6] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9.135-9.135"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              step.status === "completed"
                                ? "text-[#22C55E]"
                                : step.status === "current"
                                ? "text-[#3B82F6]"
                                : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.status === "current" && (
                            <p className="text-xs text-[#3B82F6] mt-0.5">
                              Current Step
                            </p>
                          )}
                        </div>
                        {step.status === "completed" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 text-[#22C55E]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9.135-9.135"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Progress: Step {progress.currentStep} of {progress.totalSteps}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#22C55E] h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (progress.currentStep / progress.totalSteps) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "alert" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    ></div>
                    <p className="text-sm text-gray-600">{activity.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Photos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={photo}
                    alt={`Project photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsDetailsModal;
