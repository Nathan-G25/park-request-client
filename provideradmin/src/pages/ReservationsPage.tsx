import ReservationsTable from "@/components/ReservationsTable"
import ReservationStatCard from "@/components/ReservationStatCard"

const data = {
  activeNow: 2,
  upcoming: 2,
  todaysRevenue: "$486.00",
  avgDuration: "2.1h",
}


const ReservationsPage = () => {
  return (
    <div className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold text-2xl tracking-tighter">Reservations</h1>
        <p className=" text-sm tracking-wider">Manage parking reservations and bookings</p>
      </header>
      <div className=" pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <ReservationStatCard label="Active Now" value={data.activeNow} />
        <ReservationStatCard label="Upcoming" value={data.upcoming} />
        <ReservationStatCard label="Today's Revenue" value={data.todaysRevenue} className="text-green-600" />
        <ReservationStatCard label="Avg. Duration" value={data.avgDuration} />
      </div>
      <div className=" pt-6">
        <ReservationsTable/>
      </div>
    </div>
  )
}

export default ReservationsPage