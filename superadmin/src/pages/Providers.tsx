import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProviderTable from "@/components/ProviderTable";
import ParkingAvenuesTable from "@/components/ParkingAvenuesTable";

const Providers = () => {
  return (
    <main className=" min-h-screen">
      <header className=" flex justify-between items-center">
        <div className=" flex flex-col gap-1">
          <h1 className=" font-bold tracking-tighter text-2xl">
            Provider Management
          </h1>
          <p className=" tracking-wide text-sm">
            Approve, monitor, and govern parking providers
          </p>
        </div>
        <button className=" flex gap-3 items-center text-sm justify-center text-white bg-neutral-800 rounded-lg py-3 w-50 font-medium cursor-pointer hover:bg-neutral-700 ">
          <span>+</span>
          <span>Add New Provider</span>
        </button>
      </header>
      <section className=" mt-8 w-full">
        <div className=" w-full  mb-3">
          <Tabs defaultValue="providers">
            <TabsList>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="parkingAvenues">Parking Avenues</TabsTrigger>
            </TabsList>
            <TabsContent value="providers" className=" mt-5 w-full">
              <ProviderTable />
            </TabsContent>
            <TabsContent value="parkingAvenues" className=" mt-5 w-full">
              <ParkingAvenuesTable />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Providers;
