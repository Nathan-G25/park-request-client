import PeakDemandAnalysisChart from "@/components/PeakDemandAnalysisChart";
import ReservationInfoCard from "@/components/ReservationInfoCard";
import ReservationTable from "@/components/ReservationTable";

const reservationInfo = {
  activeReservations: "1847",
  upcoming: "342",
  todaysRevenue: "$24,580",
  cancelationRate: "3.2%",
};

const Reservations = () => {
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
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-6">
        <ReservationInfoCard
          label="Active Reservations"
          value={reservationInfo.activeReservations}
        />
        <ReservationInfoCard
          label="Upcoming"
          value={reservationInfo.upcoming}
        />
        <ReservationInfoCard
          label="Today's Revenue"
          value={reservationInfo.todaysRevenue}
        />
        <ReservationInfoCard
          label="Average Reliability"
          value={reservationInfo.cancelationRate}
        />
      </section>
      <section className="mt-10 flex flex-col justify-center px-5 py-3 rounded-md shadow-lg bg-white/90">
        <div className=" flex flex-col gap-0.5 ml-1">
          <h2 className=" text-gray-900 font-medium">Peak Demand Analysis</h2>
          <p className=" text-sm text-gray-500">Reservation volume overtime</p>
          <PeakDemandAnalysisChart />
        </div>
      </section>
      <section className=" my-10">
        <ReservationTable/>
      </section>
    </main>
  );
};

export default Reservations;
