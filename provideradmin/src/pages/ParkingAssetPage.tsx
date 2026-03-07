import ParkingLocationCard from "@/components/ParkingLocationCard";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  Dialog,
  DialogClose,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddParkingAvenue } from "@/hooks/useAddParkingAvenue";
import { createParkingAvenueSchema, type CreateParkingAvenue } from "@/schema";
import type { ParkingLocation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react"; // ✅ Add this
import toast from "react-hot-toast";

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

const ParkingAssetPage = () => {
  const { mutate, isPending } = useAddParkingAvenue();
  const [open, setOpen] = useState(false); // ✅ Control dialog state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createParkingAvenueSchema),
  });

  const onSubmit = (data: CreateParkingAvenue) => {
    console.log("📤 Submitting data:", {
      legalDocLength: (data.legalDoc as FileList | undefined)?.length,
      legalDocName: (data.legalDoc as FileList | undefined)?.[0]?.name,
    });

    mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message || "Parking Avenue Created Successfully");
        reset();
        setOpen(false); 
      },
    });
  };

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-1 mb-4">
          <h1 className="text-2xl font-bold tracking-tighter">
            Parking Assets
          </h1>
          <p className="tracking-wide text-sm">Manage your parking locations</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Parking Location</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Parking Location</DialogTitle>{" "}
              <DialogDescription>
                Create a new parking location
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="pt-2 flex gap-5 items-center">
                <div>
                  <Label htmlFor="name" className="mb-1">
                    Name
                  </Label>
                  <Input {...register("name")} id="name" />
                  {errors.name && (
                    <p className="text-red-500 text-[10px]">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address" className="mb-1">
                    Address
                  </Label>
                  <Input {...register("address")} id="address" />
                  {errors.address && (
                    <p className="text-red-500 text-[10px]">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-5 items-center">
                <div>
                  <Label htmlFor="latitude" className="mb-1">
                    Latitude
                  </Label>
                  <Input {...register("latitude")} id="latitude" />
                  {errors.latitude && (
                    <p className="text-red-500 text-[10px]">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="longitude" className="mb-1">
                    Longitude
                  </Label>
                  <Input {...register("longitude")} id="longitude" />
                  {errors.longitude && (
                    <p className="text-red-500 text-[10px]">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-5 items-center">
                <div>
                  <Label htmlFor="workingHours" className="mb-1">
                    Working Hours
                  </Label>
                  <Input {...register("workingHrs")} id="workingHours" />
                  {errors.workingHrs && (
                    <p className="text-red-500 text-[10px]">
                      {errors.workingHrs.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input {...register("hourlyRate")} id="hourlyRate" />
                  {errors.hourlyRate && (
                    <p className="text-red-500 text-[10px]">
                      {errors.hourlyRate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-5 items-center">
                <div>
                  <Label htmlFor="totalSpots">Total Spots</Label>
                  <Input {...register("totalSpots")} id="totalSpots" />
                  {errors.totalSpots && (
                    <p className="text-red-500 text-[10px]">
                      {errors.totalSpots.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input {...register("status")} id="status" />
                  {errors.status && (
                    <p className="text-red-500 text-[10px]">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="my-2">
                <Label htmlFor="currentSpots">Current Spots</Label>
                <Input {...register("currentSpots")} id="currentSpots" />
                {errors.currentSpots && (
                  <p className="text-red-500 text-[10px]">
                    {errors.currentSpots.message}
                  </p>
                )}
              </div>

              <div className="my-2">
                <Label htmlFor="legalDocument">Legal Document</Label>
                <Input
                  {...register("legalDoc", {
                    required: "Legal document is required",
                    validate: {
                      notEmpty: (value) => {
                        console.log("🔍 File validation:", {
                          value,
                          length: value?.length,
                          isFileList: value instanceof FileList,
                        });
                        return value?.length > 0 || "Please select a file";
                      },
                    },
                  })}
                  type="file"
                  id="legalDocument"
                  accept=".jpg,.jpeg,.png"
                />
                {errors.legalDoc && (
                  <p className="text-red-500 text-[10px]">
                    {String(errors.legalDoc.message)}
                  </p>
                )}
              </div>

              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {mockData.map((loc) => (
        <ParkingLocationCard key={loc.name} location={loc} />
      ))}
    </div>
  );
};

export default ParkingAssetPage;
