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