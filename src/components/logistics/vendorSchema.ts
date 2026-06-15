import { z } from "zod";

const isPhoneNumber = (value: string) => {
  const normalizedValue = value.replace(/[\s()-]/g, "");
  return /^\+?\d{7,15}$/.test(normalizedValue);
};

const parseGpsCoordinates = (value: string) => {
  const [latRaw, lngRaw] = value.split(",");
  if (!latRaw || !lngRaw) {
    return null;
  }
  const lat = Number.parseFloat(latRaw.trim());
  const lng = Number.parseFloat(lngRaw.trim());
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }
  return { lat, lng };
};

export const vendorSchema = z.object({
  vendorName: z
    .string()
    .trim()
    .min(1, "Vendor name is required.")
    .refine((val) => !/^\d+$/.test(val), {
      message: "Vendor name cannot be numbers.",
    }),
  vendorCode: z.string().trim().optional(),
  contactName: z
    .string()
    .trim()
    .min(1, "Contact name is required.")
    .refine((val) => !/^\d+$/.test(val), {
      message: "Contact name cannot be numbers.",
    }),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .refine((value) => isPhoneNumber(value), {
      message: "Enter a valid phone number.",
    }),
  yearsWithCompany: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z.number({ message: "Enter a valid number of years." })
      .min(1, "Years with company is required.")
  ),
  serviceCategory: z.string().trim().min(1, "Service category is required."),
  address: z.object({
    placeNumber: z.string().trim().min(1, "Place number is required."),
    streetAddress: z
      .string()
      .trim()
      .min(1, "Street address is required.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "Street address cannot be numbers only.",
      }),
    landmark: z
      .string()
      .trim()
      .min(1, "Landmark is required.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "Landmark cannot be numbers only.",
      }),
    city: z
      .string()
      .trim()
      .min(1, "City is required.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "City cannot be numbers only.",
      }),
    state: z
      .string()
      .trim()
      .min(1, "State is required.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "State cannot be numbers only.",
      }),
    postalCode: z.preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return Number.isNaN(num) ? undefined : num;
      },
      z.number({ message: "Postal code must be a number." }).min(1, "Postal code is required.")
    ),
    gpsCoordinates: z
      .string()
      .trim()
      .min(1, "GPS coordinates are required.")
      .refine((value) => parseGpsCoordinates(value) !== null, {
        message: "Enter coordinates in the format 'lat, lng'.",
      })
      .transform((value) => parseGpsCoordinates(value)!),
  }),
  vendorType: z.string().trim().min(1, "Vendor type is required."),
  materialTypes: z
    .array(z.string().trim().min(1))
    .min(1, "Material types is required."),
  documents: z
    .array(
      z.object({
        name: z.string().trim(),
        url: z.string().trim(),
        size: z.number().optional(),
      }),
    )
    .default([]),
  internalNotes: z.string().trim().optional().or(z.literal("")),
});

export type VendorFormInput = z.input<typeof vendorSchema>;
export type VendorFormValues = z.output<typeof vendorSchema>;
export { isPhoneNumber, parseGpsCoordinates };
