import WardenInfoCard from "@/components/WardenInfoCard";
import WardenTable from "@/components/WardenTable";

const wardenInfo = {
    totalWardens: "312",
    activeNow: "3",
    flagged: "1",
    avgReliability: "94.2%",
}

const Wardens = () => {
  return (
    <main className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">Warden Oversight</h1>
        <p className=" tracking-wide text-sm">Monitor and govern warden activity across the network</p>
      </header>
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-4 items-center">
        <WardenInfoCard label="Total Wardens" value={wardenInfo.totalWardens}/>
        <WardenInfoCard label="Active Now" value={wardenInfo.activeNow} className=" text-green-500"/>
        <WardenInfoCard label="Flagged" value={wardenInfo.flagged} className=" text-orange-500"/>
        <WardenInfoCard label="Avg. Reliability" value={wardenInfo.avgReliability}/>
      </section>
      <section className=" mt-10 pb-10">
        <WardenTable/>
      </section>
    </main>
  );
};

export default Wardens;
