import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import { Phone, Mail, Copy, Check, User, MapPin, Building2, Package } from "lucide-react";

interface ContactPocModalProps {
  isOpen: boolean;
  onClose: () => void;
  pocName?: string;
  phone?: string;
  email?: string;
  projectName?: string;
  deliveryNumber?: string;
  siteLocation?: string;
}

const ContactPocModal: React.FC<ContactPocModalProps> = ({
  isOpen,
  onClose,
  pocName,
  phone,
  email,
  projectName,
  deliveryNumber,
  siteLocation,
}) => {
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: "phone" | "email") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const displayName = pocName?.trim() || "Receiving Point of Contact";
  const displayPhone = phone?.trim();
  const displayEmail = email?.trim();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "POC";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Point of Contact (POC)" width="max-w-lg">
      <div className="space-y-4">
        {/* POC Header Profile */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="w-14 h-14 rounded-full bg-[#1E51A4] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E51A4] bg-white px-2 py-0.5 rounded-full border border-blue-200">
              Site Receiving POC
            </span>
            <h3 className="text-lg font-semibold text-[#101828] truncate mt-1">
              {displayName}
            </h3>
            <p className="text-xs text-[#6A7282] flex items-center gap-1.5 mt-0.5">
              <User size={13} className="shrink-0" /> Primary contact on site for delivery check-in
            </p>
          </div>
        </div>

        {/* Contact Actions List */}
        <div className="space-y-3">
          {/* Phone row */}
          <div className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#6A7282] uppercase">Phone Number</p>
                <p className="text-sm font-semibold text-[#101828] truncate">
                  {displayPhone || "No phone number available"}
                </p>
              </div>
            </div>

            {displayPhone && (
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleCopy(displayPhone, "phone")}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#4A5565] bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  title="Copy Phone"
                >
                  {copiedField === "phone" ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`tel:${displayPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <Phone size={13} /> Call
                </a>
              </div>
            )}
          </div>

          {/* Email row */}
          <div className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#6A7282] uppercase">Email Address</p>
                <p className="text-sm font-semibold text-[#101828] truncate">
                  {displayEmail || "No email address provided"}
                </p>
              </div>
            </div>

            {displayEmail && (
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleCopy(displayEmail, "email")}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#4A5565] bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  title="Copy Email"
                >
                  {copiedField === "email" ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${displayEmail}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E51A4] hover:bg-[#173e7c] rounded-lg shadow-xs transition-colors"
                >
                  <Mail size={13} /> Email
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Context Details */}
        {(projectName || deliveryNumber || siteLocation) && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
            <p className="font-semibold text-gray-700 uppercase tracking-wide text-[11px]">Delivery Context</p>
            {projectName && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={14} className="shrink-0 text-gray-400" />
                <span className="font-medium text-gray-800">{projectName}</span>
              </div>
            )}
            {deliveryNumber && (
              <div className="flex items-center gap-2 text-gray-600">
                <Package size={14} className="shrink-0 text-gray-400" />
                <span>Delivery Ref: <strong className="text-gray-800">{deliveryNumber}</strong></span>
              </div>
            )}
            {siteLocation && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={14} className="shrink-0 text-gray-400 mt-0.5" />
                <span className="line-clamp-2">{siteLocation}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end pt-2">
          <Button variant="white" onClick={onClose} size="md">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactPocModal;
