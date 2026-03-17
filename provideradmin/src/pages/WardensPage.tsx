import WardenCard from "@/components/WardenCard";
import WardenStatCard from "@/components/WardenStatCard";
import { wardenSchema, type Warden } from "@/schema";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Star } from "lucide-react";
import z, { ZodError } from "zod";
import { fetchParkingAvenues } from "./ParkingAssetPage";

const data = {
  online: 8,
  onBreak: 2,
  avgReliability: 92,
};

const fecthWardens = async (parkingAvenue: string): Promise<Warden[]> => {
  const storedUser = localStorage.getItem("user");
  const parkingAvenueId = parkingAvenue;

  if (!storedUser) {
    throw new Error("No user found");
  }

  const user = JSON.parse(storedUser);
  const token = user.accessToken;

  if (!token) {
    throw new Error("No accesstoken found");
  }

  console.log(parkingAvenueId);

  const response = await fetch(
    `http://localhost:3000/warden?id=${parkingAvenueId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(`${response.status} Could not fetch warden profile`);
  }
  try {
    const parsedData = z.array(wardenSchema).parse(data);
    return parsedData;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Zod validation failed on API response:", err.message);
    }
    return [];
  }
};

const WardensPage = () => {
  const { data: location } = useQuery({
    queryKey: ["parkingAvenues"],
    queryFn: fetchParkingAvenues,
    retry: false,
  });

  const { data: warden, error } = useQuery({
    queryKey: ["wardens", location?.[0]?.id],
    queryFn: () => {
      if (!location?.[0]?.id) {
        // Return empty array or handle as needed when id is not available
        return Promise.resolve([]);
      }
      return fecthWardens(location[0].id);
    },
    enabled: !!location?.[0]?.id,
    retry: false,
  });

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
        {warden &&
          warden.map((wardens) => (
            <WardenCard key={wardens.id} warden={wardens} />
          ))}
      </div>
    </div>
  );
};

export default WardensPage;
