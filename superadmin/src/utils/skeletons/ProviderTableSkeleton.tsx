import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ProviderTableSkeleton.tsx (or inline)
const ProviderTableSkeleton = () => (
  <div className="rounded-md border">
    {/* Search bar skeleton */}
    <div className="p-4 border-b">
      <Skeleton className="h-10 w-full max-w-sm" />
    </div>

    {/* Tabs skeleton */}
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-9 w-24" />
    </div>

    {/* Table header skeleton */}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          <TableHead className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
          <TableHead className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
          <TableHead><Skeleton className="h-4 w-16" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 5 skeleton rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell className="py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ProviderTableSkeleton;