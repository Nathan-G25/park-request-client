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