import { z } from "zod";

export const globalStatsSchema = z.object({
    totalProviders: z.coerce.number(),
    activeLocations: z.coerce.number(),
    onStreetSegments: z.coerce.number(),
    offStreetLots: z.coerce.number(),
    totalUsers: z.coerce.number(),
    activeReservations: z.coerce.number(),
    totalRevenue: z.coerce.number()
})

export type OverallStats = z.infer<typeof globalStatsSchema>

export const providerSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    phoneNo: z.string(),
    email: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    lastLogin: z.string().nullable(),
    isVerified: z.enum(["APPROVED", "UNDERREVIEW", "REJECTED"]),
    personalId: z.string(),
    rejectionReason: z.string().optional().nullable(),
    totalLocations: z.coerce.number().default(0),
    totalSpaces: z.coerce.number().default(0),
})

export type Provider = z.infer<typeof providerSchema>

export const PaginatedOwnersSchema = z.object({
    data: z.array(providerSchema),
    meta: z.object({
        nextCursor: z.string().nullable().optional(),
        hasMore: z.boolean(),
    }),
});

export type PaginatedOwners = z.infer<typeof PaginatedOwnersSchema>

export const parkingAvenueSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    ownerId: z.string(),
    workingHrs: z.string(),
    hourlyRate: z.coerce.number().min(0),
    type: z.enum(["ON_STREET", "OFF_STREET"]),
    totalSpots: z.coerce.number().min(0).default(0),
    status: z.enum(["OPEN", "CLOSED", "FULL"]),
    currentSpots: z.coerce.number().min(0).default(0),
    legalDoc: z.string().optional().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    approvalStatus: z.enum(["APPROVED", "UNDERREVIEW", "REJECTED"]),
    rejectionReason: z.string().optional().nullable(),
});

export type ParkingAvenue = z.infer<typeof parkingAvenueSchema>

export const paginatedParkingAvenueSchema = z.object({
    data: z.array(parkingAvenueSchema),
    meta: z.object({
        nextCursor: z.string().nullable().optional(),
        hasMore: z.boolean(),
    }),
});

export type PaginatedParkingAvenues = z.infer<typeof paginatedParkingAvenueSchema>

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().min(10, "Phone number is too short"),
    personalId: z.instanceof(FileList).refine(
    (files) => files?.length === 1, 
    "Personal ID image is required"
  ),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const createParkingAvenueSchema = z.object({
    username: z.string().min(1, "Owner username is required"), // Added
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    workingHrs: z.string().min(1, "Working hours are required"),
    hourlyRate: z.coerce.number().min(0),
    totalSpots: z.coerce.number().int().min(1),
    type: z.enum(["ON_STREET", "OFF_STREET"]),
    status: z.enum(["OPEN", "CLOSED", "FULL"]),
    subCity: z.enum([
        'ADDISKETEMA', 'AKAKYKALITI', 'ARADA', 'BOLE', 'GULLELE',
        'KIRKOS', 'KOLFEKERANIO', 'LIDETA', 'NIFASSILKLAFTO', 'YEKA', 'LEMIKURA'
    ]),
    currentSpots: z.coerce.number().int().min(1),
    endLatitude: z.coerce.number().min(-90).max(90).optional().nullable(),
    endLongitude: z.coerce.number().min(-180).max(180).optional().nullable(),
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

export const wardenSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  wardenStatus: z.string(),
  parkingAvenueId: z.string().nullable(),
  createdAt: z.string().datetime().optional(), // or z.date() if pre-parsed
});

export const wardenPaginationSchema = z.object({
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
  totalWardens: z.number().int().nonnegative(),
  onDutyCount: z.number().int().nonnegative(),
  offDutyCount: z.number().int().nonnegative(),
});


export const wardenResponseSchema = z.object({
  wardens: z.array(wardenSchema),
  pagination: wardenPaginationSchema,
});

export type Warden = z.infer<typeof wardenSchema>;
export type WardenResponse = z.infer<typeof wardenResponseSchema>;