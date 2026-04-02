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
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  workingHrs: z.string().min(1, "Working hours are required"),
  hourlyRate: z.coerce.number().min(0),
  totalSpots: z.coerce.number().int().min(1),
  status: z.enum(["OPEN", "CLOSED", "FULL"]),
  subCity: z.enum([
    'ADDISKETEMA',
    'AKAKYKALITI',
    'ARADA',
    'BOLE',
    'GULLELE',
    'KIRKOS',
    'KOLFEKERANIO',
    'LIDETA',
    'NIFASSILKLAFTO',
    'YEKA',
    'LEMIKURA'
  ],),
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

export const ProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNo: z.string(),
  isVerified: z.string(),
});

export type UserProfile = z.infer<typeof ProfileSchema>;

export const parkingAvenueResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  ownerId: z.string(),
  workingHrs: z.string(),
  hourlyRate: z.coerce.number().min(0),
  type: z.string(),
  totalSpots: z.coerce.number().min(0).default(0),
  status: z.enum(["OPEN", "CLOSED", "FULL"]),
  currentSpots: z.coerce.number().min(0).default(0),
  legalDoc: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  approvalStatus: z.string(),
  rejectionReason: z.string().optional().nullable(),
});

export type ParkingAvenue = z.infer<typeof parkingAvenueResponseSchema>;

export const paginatedAvenueResponseSchema = z.object({
  data: z.array(parkingAvenueResponseSchema),
  meta: z.object({
    nextCursor: z.string().nullable().optional(),
    hasMore: z.boolean(),
  }),
});

export type PaginatedParkingAvenues = z.infer<typeof paginatedAvenueResponseSchema>;

export const createWardenSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  phoneNo: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (e.g., +251...)')
    .optional()
    .or(z.literal('')), // Allows empty string in forms without triggering error

  gender: z.enum(["MALE", "FEMALE"]),

  wardenStatus: z.enum(["ONDUTY", "OFFDUTY"]),

  residenceArea: z
    .string()
    .min(1, 'Residence area is required'),

  parkingAvenueId: z
    .string()
    .uuid('Invalid ID format')
    .min(1, 'Please select a parking avenue'),
});

export type CreateWarden = z.infer<typeof createWardenSchema>;

export const wardenSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  phoneNo: z.string(),
  gender: z.string(),
  wardenStatus: z.string(),
  residenceArea: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLogin: z.string().nullable(),
  parkingAvenueId: z.string(),
});

export type Warden = z.infer<typeof wardenSchema>;

export const paginatedWardenSchema = z.object({
  data: z.array(wardenSchema),
  meta: z.object({
    nextCursor: z.string().nullable().optional(),
    hasMore: z.boolean(),
  }),
});

export type PaginatedWardens = z.infer<typeof paginatedWardenSchema>;

export const liveActivitySchema = z.object({
  type: z.enum(['RESERVATION', 'WALK_IN']),
  message: z.string(),
  timestamp: z.date(),
  metadata: z.any().optional().nullable()
});

export type LiveActivity = z.infer<typeof liveActivitySchema>;
