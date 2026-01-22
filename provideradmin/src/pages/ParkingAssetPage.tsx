import ParkingLocationCard from "@/components/ParkingLocationCard";
import type { ParkingLocation } from "@/types";

const mockData: ParkingLocation[] = [
  {
    name: "Edna Mall Parking",
    address: "Bole Road, Addis Ababa",
    type: "Mall",
    status: "Partial",
    occupiedSpots: 312,
    totalSpots: 450,
    lastUpdated: "2 min ago",
  },
  {
    name: "Tikur Anbessa Hospital Garage",
    address: "Churchill Avenue, Addis Ababa",
    type: "Hospital",
    status: "Available",
    occupiedSpots: 45,
    totalSpots: 200,
    lastUpdated: "5 min ago",
  },
 
];


  const handleMoreClick = (name: string) => {
    console.log("View details for:", name);
  };



const ParkingAssetPage = () => {
  return (
    <div className=" flex flex-col justify-center gap-5">
      <div className=" flex flex-col justify-center gap-1 mb-4">
        <h1 className=" text-3xl font-bold tracking-tighter">Parking Assets</h1>
        <p>Manage your parking locations</p>
      </div>
      {mockData.map((loc) => (
        <ParkingLocationCard
          key={loc.name}
          location={loc}
          onMoreClick={handleMoreClick}
        />
      ))}
    </div>
  )
}

export default ParkingAssetPage