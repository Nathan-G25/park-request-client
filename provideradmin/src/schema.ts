import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().min(10, "Phone number is too short"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  personalId: z
    .any()
    .refine((files) => files?.length === 1, "ID Image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 2MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png are supported"
    ),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const createParkingAvenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  workingHrs: z.string().min(1, "Working hours are required"),
  hourlyRate: z.coerce.number().min(0),
  totalSpots: z.coerce.number().int().min(1),
  status: z.enum(["OPEN", "CLOSED", "FULL"]),
  currentSpots: z.coerce.number().int().min(0),
  legalDoc: z
    .any()
    .refine((files) => files?.length === 1, "Legal Document Image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 2MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png are supported"
    ),
}).refine((data) => data.currentSpots <= data.totalSpots, {
  message: "Current spots cannot exceed total spots",
  path: ["currentSpots"],
});

export type CreateParkingAvenue = z.infer<typeof createParkingAvenueSchema>