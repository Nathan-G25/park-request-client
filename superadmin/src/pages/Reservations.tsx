import PeakDemandAnalysisChart from "@/components/PeakDemandAnalysisChart";
import ReservationInfoCard from "@/components/ReservationInfoCard";
import ReservationTable from "@/components/ReservationTable";
import { useQuery } from "@tanstack/react-query";

const reservationInfo = {
  activeReservations: "1847",
  upcoming: "342",
  todaysRevenue: "$24,580",
  cancelationRate: "3.2%",
};

type kpiRevenueStat = {
  activeReservations: number;
  upcomingReservations: number;
  todaysRevenue: number;
}

const fetchRevenueKPI = async (): Promise<kpiRevenueStat> => {

  const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

  const response = await fetch("http://localhost:3000/admin/reservation-dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log(response);

  if(!response.ok) {
    throw new Error(`${response.status}: Failed to fetch stat`);
  }

  const result = await response.json();



    return result;
  }


const Reservations = () => {

  const {data: revenueKpi, error} = useQuery({
    queryKey: ["revenueKpi"],
    queryFn: fetchRevenueKPI,
    retry:false,
  })

  return (
    <main className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">
          Reservations & Demand{" "}
        </h1>
        <p className=" tracking-wide text-sm">
          Monitor system-wide demand and reservation activity
        </p>
      </header>
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-6">
        <ReservationInfoCard
          label="Active Reservations"
          value={revenueKpi?.activeReservations}
        />
        <ReservationInfoCard
          label="Upcoming"
          value={revenueKpi?.upcomingReservations}
        />
        <ReservationInfoCard
          label="Today's Revenue"
          value={revenueKpi?.todaysRevenue}
        />
       
      </section>
      <section className="mt-10 flex flex-col justify-center px-5 py-3 rounded-md shadow-lg bg-white/90">
        <div className=" flex flex-col gap-0.5 ml-1">
          <h2 className=" text-gray-900 font-medium">Peak Demand Analysis</h2>
          <p className=" text-sm text-gray-500">Reservation volume overtime</p>
          <PeakDemandAnalysisChart />
        </div>
      </section>
    </main>
  );
};

export default Reservations;
