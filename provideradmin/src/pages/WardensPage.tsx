import WardenCard from "@/components/WardenCard";
import WardenStatCard from "@/components/WardenStatCard";
import type { Warden } from "@/types";
import { CheckCircle2, Clock, Star } from "lucide-react";

const data = {
  online: 8,
  onBreak: 2,
  avgReliability: 92,
};

const mockWardens: Warden[] = [
  {
    firstName: "Abebe",
    lastName: "Kebede",
    status: "Online",
    reliabilityScore: 98,
    shiftsThisWeek: 5,
    location: "Edna Mall - Lot A",
    phoneNumber: "+251 91 234 5678",
  },
  {
    firstName: "Tigist", 
    lastName: "Haile",
    status: "Online",
    reliabilityScore: 95,
    shiftsThisWeek: 4,
    location: "Tikur Anbessa Hospital",
    phoneNumber: "+251 91 345 6789",
  },
  {
  
    firstName: "Dawit",
    lastName: "Tesfaye",
    status: "Break",
    reliabilityScore: 92,
    shiftsThisWeek: 6,
    location: "Ethio-Telecom Tower",
    phoneNumber: "+251 91 456 7890",
  },
  {
  
    firstName: "Dawit",
    lastName: "Tesfaye",
    status: "Offline",
    reliabilityScore: 92,
    shiftsThisWeek: 6,
    location: "Ethio-Telecom Tower",
    phoneNumber: "+251 91 456 7890",
  },
];

const WardensPage = () => {
  return (
    <div>
      <div className=" flex flex-col justify-center gap-1">
        <h1 className=" font-bold text-3xl tracking-tighter">
          Warden Management
        </h1>
        <p>Monitor and manage your parking wardens</p>
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
        <button className=" flex gap-3 items-center justify-center text-white bg-neutral-800 rounded-lg py-3 w-50 font-medium cursor-pointer hover:bg-neutral-700 ">
          <span>+</span>
          <span>Add Warden</span>
        </button>
      </div>
      <div className=" space-y-5 pt-5">
        {mockWardens.map((wardens) => (
          <WardenCard key={wardens.firstName} warden={wardens} />
        ))}
      </div>
    </div>
  );
};

export default WardensPage;
