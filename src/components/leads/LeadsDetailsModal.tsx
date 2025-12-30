import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLeadsData } from "../../data/mockData";
import TrackLeadsLifecycleModal from "./TrackLeadsLifecycleModal";
import ProjectMediaModal from "./ProjectMediaModal";

interface LeadsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadsDetailsModal: React.FC<LeadsDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isTrackLifecycleOpen, setIsTrackLifecycleOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  if (!isOpen) return null;

  const {
    id,
    contactInfo,
    projectDetails,
    assignment,
    progress,
    recentActivity,
    photos,
  } = mockLeadsData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
              Leads Details - {contactInfo.fullName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">{id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-8">
          {/* Actions */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => {
                onClose();
                navigate("/communication");
              }}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
            >
              <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3 h-3 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              Open Chat
            </button>
            <button
              onClick={() => setIsTrackLifecycleOpen(true)}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
            >
              Track Order Lifecycle
            </button>
            <button
              onClick={() => setIsMediaModalOpen(true)}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
            >
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
            <div className="bg-[#fcfcfc] rounded-2xl p-5 border border-gray-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Assignment
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#0D9488]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Assigned to: {assignment.assignedTo}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    1 person working on this lead
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Card */}
            <div className="bg-[#fcfcfc] rounded-2xl p-5 border border-gray-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Signed Contract/Agreement
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#0D9488]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"
                      clipRule="evenodd"
                    />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Signed contact/Agreement
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    Signed on: 12 April 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-6 font-primary">
              Progress Steps
            </h3>
            <div className="bg-[#fcfcfc] rounded-xl p-6 border border-gray-100">
              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

                {progress.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white
                      ${
                        step.status === "completed"
                          ? "bg-[#3AB449]"
                          : step.status === "current"
                          ? "bg-[#2563EB]"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs font-semibold">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              step.status === "completed"
                                ? "text-[#111827]"
                                : step.status === "current"
                                ? "text-[#2563EB]"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.status === "current" && (
                            <p className="text-[10px] text-[#2563EB] mt-0.5 uppercase font-semibold">
                              Current Step
                            </p>
                          )}
                        </div>
                        {step.status === "completed" && (
                          <div className="flex gap-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                              stroke="currentColor"
                              className="w-4 h-4 text-[#3AB449]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9.135-9.135"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                              stroke="currentColor"
                              className="w-4 h-4 text-[#3AB449]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9.135-9.135"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Progress: Step {progress.currentStep} of {progress.totalSteps}
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="bg-[#3AB449] h-1 rounded-full transition-all duration-500"
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
            <h3 className="text-base font-semibold text-gray-900 mb-4 font-primary">
              Recent Activity
            </h3>
            <div className="bg-[#fcfcfc] rounded-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        activity.type === "alert"
                          ? "bg-[#EF4444]"
                          : "bg-[#3B82F6]"
                      }`}
                    ></div>
                    <p className="text-sm text-gray-600 font-medium">
                      {activity.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 font-primary">
              Photos
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <img
                    src={photo}
                    alt={`Project photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 md:p-6 border-t border-gray-100 flex justify-end z-90">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      <TrackLeadsLifecycleModal
        isOpen={isTrackLifecycleOpen}
        onClose={() => setIsTrackLifecycleOpen(false)}
        leadData={{ id, name: contactInfo.fullName }}
      />

      <ProjectMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        projectData={{
          name: "ABC Logistics Warehouse",
          id: "PEB-1021",
          uploadedBy: "Rahul Sharma",
          location: "Pune, Maharashtra",
          lastUpdate: "25-April-2025",
        }}
      />
    </div>
  );
};

export default LeadsDetailsModal;
