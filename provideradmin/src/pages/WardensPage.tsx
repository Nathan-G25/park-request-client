import WardenCard from "@/components/WardenCard";
import WardenStatCard from "@/components/WardenStatCard";
import { paginatedWardenSchema, type PaginatedWardens } from "@/schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const data = {
  online: 8,
  onBreak: 2,
  avgReliability: 92,
};

const fecthWardens = async (): Promise<PaginatedWardens> => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("No user found");
  }

  const user = JSON.parse(storedUser);
  const token = user.accessToken;

  if (!token) {
    throw new Error("No accesstoken found");
  }

  const response = await fetch(
    "http://localhost:3000/parking-avenue-owner/wardens",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(`${response.status} Could not fetch warden profile`);
  }

  const result = await response.json();

  const normalizedResult = Array.isArray(result)
    ? {
        data: result,
        meta: { nextCursor: null, hasMore: false },
      }
    : {
        ...result,
        meta: {
          nextCursor: result?.meta?.nextCursor ?? null,
          hasMore: Boolean(result?.meta?.hasMore ?? result?.meta?.hasmore),
        },
      };

  try {
    const parsedData = paginatedWardenSchema.parse(normalizedResult);
    return parsedData;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Zod validation failed on API response:", err.message);
    }
    return { data: [], meta: { nextCursor: null, hasMore: false } };
  }
};

const WardensPage = () => {
  // const { data: location } = useQuery({
  //   queryKey: ["parkingAvenues"],
  //   queryFn: fetchParkingAvenues,
  //   retry: false,
  // });

  const {
    data: warden,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["wardens"],
    queryFn: fecthWardens,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    retry: false,
  });

  const wardens = useMemo(
    () => warden?.pages.flatMap((page) => page.data) ?? [],
    [warden],
  );

  if (error) {
    console.error("Error fetching user profile:", error);
  }

  return (
    <div>
      <div className=" flex flex-col justify-center gap-1">
        <h1 className=" font-bold text-2xl tracking-tighter">
          Warden Management
        </h1>
        <p className=" tracking-wide text-sm">
          Monitor and manage your parking wardens
        </p>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <WardenStatCard
          icon={CheckCircle2}
          value={data.online}
          label="Currently Online"
          color="success"
        />
        <WardenStatCard
          icon={Clock}
          value={data.onBreak}
          label="On Break"
          color="warning"
        />
        <WardenStatCard
          icon={Star}
          value={`${data.avgReliability}%`}
          label="Avg.Reliability"
          color="accent"
        />
      </div>
      <div className=" mt-12 flex justify-between items-center">
        <h2 className=" text-lg font-semibold">All Wardens</h2>
      </div>
      <div className=" space-y-5 pt-5 pb-6">
        {wardens &&
          wardens.map((ward: (typeof wardens)[0]) => (
            <WardenCard key={ward.id} warden={ward} />
          ))}
      </div>
      <div className="flex flex-col items-center mt-8 pb-10">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Assets"}
          </Button>
        )}

        {!hasNextPage && wardens.length > 0 && (
          <p className="text-muted-foreground text-sm">
            You've reached the end of your assets.
          </p>
        )}
      </div>
    </div>
  );
};

export default WardensPage;
