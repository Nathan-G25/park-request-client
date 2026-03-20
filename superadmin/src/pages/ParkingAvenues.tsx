import ParkingAvenuesTable from "@/components/ParkingAvenuesTable";

const ParkingAvenues = () => {
  return (
    <main className=" min-h-screen">
      <header className=" flex justify-between items-center">
        <div className=" flex flex-col gap-1">
          <h1 className=" font-bold tracking-tighter text-2xl">
            Parking Avenue Management
          </h1>
          <p className=" tracking-wide text-sm">
            Approve, monitor, and govern parking avneues
          </p>
        </div>
        <button className=" flex gap-3 items-center text-sm justify-center text-white bg-neutral-800 rounded-lg py-3 w-50 font-medium cursor-pointer hover:bg-neutral-700 ">
          <span>+</span>
          <span>Add New Location</span>
        </button>
      </header>
      <section className=" mt-8 w-full">
        <ParkingAvenuesTable />
      </section>
    </main>
  );
};

export default ParkingAvenues;
