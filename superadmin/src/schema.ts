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
})

export type Provider = z.infer<typeof providerSchema>

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
    approvalStatus: z.enum(["APPROVED", "UNDERREVIEW", "REJECTED"])
});

export type ParkingAvenue = z.infer<typeof parkingAvenueSchema>
