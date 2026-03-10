import { z } from "zod";

export const globalStats = z.object({
    totalProviders: z.coerce.number(),
    activeLocations: z.coerce.number(),
    onStreetSegments: z.coerce.number(),
    offStreetLots: z.coerce.number(),
    totalUsers: z.coerce.number(),
    activeReservations: z.coerce.number(),
    totalRevenue: z.coerce.number()
})

export type OverallStats = z.infer<typeof globalStats>