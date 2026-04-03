import WardenInfoCard from "@/components/WardenInfoCard";
import WardenTable, { fetchWardens } from "@/components/WardenTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const wardenInfo = {
    totalWardens: "312",
    activeNow: "3",
    flagged: "1",
    avgReliability: "94.2%",
}

const Wardens = () => {
  const { data: wardens, error } = useQuery({
    queryKey: ["wardens"],
    queryFn: () => fetchWardens({}),
    retry: false,
  });
 
  if(error) {
    toast.error(error.message)
  }

  return (
    <main className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">Warden Oversight</h1>
        <p className=" tracking-wide text-sm">Monitor and govern warden activity across the network</p>
      </header>
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-3 items-center">
        <WardenInfoCard label="Total Wardens" value={wardens?.pagination.totalWardens ?? ""}/>
        <WardenInfoCard label="On Duty" value={wardens?.pagination.onDutyCount ?? ""} className=" text-green-500"/>
        <WardenInfoCard label="Off Duty" value={wardens?.pagination.offDutyCount ?? ""} className=" text-orange-500"/>
      </section>
      <section className=" mt-10 pb-10">
        <WardenTable/>
      </section>
    </main>
  );
};

export default Wardens;
