export const VENDOR_TYPES = [
  "steel",
  "insulation",
  "panels",
  "trim",
  "hardware",
  "other",
] as const;

export type VendorType = (typeof VENDOR_TYPES)[number];
