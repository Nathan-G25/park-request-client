import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Car, MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn, formatWorkingHours, parseWorkingHours } from "@/lib/utils";
import {
  createWardenSchema,
  editParkingAvenueSchema,
  type CreateWarden,
  type editParkingAvenue,
  type ParkingAvenue,
} from "@/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAddWarden } from "@/hooks/useAddWarden";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEditAvenue } from "@/hooks/useEditAvenue";

interface ParkingLocationCardProps {
  location: ParkingAvenue;
}

const ParkingLocationCard = ({ location }: ParkingLocationCardProps) => {
  const { mutate, isPending } = useAddWarden();
  const { mutate: mutateAvenue, isPending: isPendingAvenue } =useEditAvenue();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createWardenSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNo: "",
      gender: "MALE",
      wardenStatus: "OFFDUTY",
      residenceArea: "",
      parkingAvenueId: location.id,
    },
  });
  const {
    register: registerAvenue,
    control: controlAvenue,
    handleSubmit: handleSubmitAvenue,
    reset: resetAvenue,
    formState: { errors: avenueErrors },
  } = useForm({
    resolver: zodResolver(editParkingAvenueSchema),
    defaultValues: {
      name: location.name,
      ...parseWorkingHours(location.workingHrs),
      hourlyRate: location.hourlyRate,
      totalSpots: location.totalSpots,
      currentSpots: location.currentSpots,
      status: location.status,
    },
  });

  const onSubmit = (data: CreateWarden) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message || "Warden Created Successfully");
        reset();
        setOpen(false);
      },
    });
  };

  const onAvenueSubmit = (data: editParkingAvenue) => {
  const payload = {
    ...data,
    workingHrs: formatWorkingHours(data.startTime, data.endTime),
  };

  mutateAvenue(payload, {
    onSuccess: () => {
      toast.success("Avenue updated!");
      setOpenEdit(false);
    },
  });
};

  const percentage = Math.round(
    (location.currentSpots / location.totalSpots) * 100,
  );
  const isLow = percentage <= 30;
  const isMedium = percentage > 30 && percentage <= 70;

  return (
    <Card className="overflow-hidden transition-all shadow-md hover:shadow-lg">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start flex-wrap justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Car className="size-7 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base leading-tight">
                {location.name}
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                <MapPin className="size-4 inline" /> {location.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs lowercase">
              {location.type}
            </Badge>
            <Badge
              className={cn(
                "text-sm capitalize font-medium",
                isLow
                  ? "bg-green-100 text-green-500"
                  : isMedium
                    ? "bg-orange-100 text-orange-500"
                    : "bg-red-600",
              )}
            >
              {location.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Triggers the dialog*/}
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  Add warden
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                  Edit avenue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-medium">
              {location.currentSpots} / {location.totalSpots} spaces
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "absolute h-full transition-all duration-500 ease-out",
                isLow
                  ? "bg-green-600"
                  : isMedium
                    ? "bg-orange-500"
                    : "bg-red-600",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className=" hidden">Last updated </span>
            <span
              className={cn(
                "font-medium text-base pt-2",
                isLow
                  ? "text-green-600"
                  : isMedium
                    ? "text-orange-600"
                    : "text-red-600",
              )}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </CardContent>

      {/* Warden Registration form*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Warden</DialogTitle>
            <DialogDescription>
              Add a new warden for this parking avenue
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pt-2 flex gap-5 items-center">
              <div>
                <Label htmlFor="firstName" className="mb-1">
                  First Name
                </Label>
                <Input {...register("firstName")} id="firstName" />
                {errors.firstName && (
                  <p className="text-red-500 text-[10px]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="mb-1">
                  Last Name
                </Label>
                <Input {...register("lastName")} id="lastName" />
                {errors.lastName && (
                  <p className="text-red-500 text-[10px]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-5 items-center">
              <div>
                <Label htmlFor="username" className="mb-1">
                  Username
                </Label>
                <Input {...register("username")} id="username" />
                {errors.username && (
                  <p className="text-red-500 text-[10px]">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phoneNo" className="mb-1">
                  Phone No
                </Label>
                <Input {...register("phoneNo")} id="phoneNo" />
                {errors.phoneNo && (
                  <p className="text-red-500 text-[10px]">
                    {errors.phoneNo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-5 items-center">
              <div className=" w-full">
                <Label htmlFor="gender" className="mb-1">
                  Gender
                </Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.gender ? "border-destructive w-full" : "w-full"
                        }
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-[10px]">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <Label htmlFor="wardenStatus">Warden Status</Label>
                <Controller
                  control={control}
                  name="wardenStatus"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.wardenStatus
                            ? "border-destructive w-full"
                            : "w-full"
                        }
                      >
                        <SelectValue placeholder="Select warden status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONDUTY">ONDUTY</SelectItem>
                        <SelectItem value="OFFDUTY">OFFDUTY</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.wardenStatus && (
                  <p className="text-red-500 text-[10px]">
                    {errors.wardenStatus.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="residenceArea">Residence</Label>
              <Input {...register("residenceArea")} id="residenceArea" />
              {errors.residenceArea && (
                <p className="text-red-500 text-[10px]">
                  {errors.residenceArea.message}
                </p>
              )}
            </div>

            <div className="hidden">
              <Input
                {...register("parkingAvenueId")}
                type="hidden"
                value={location.id}
              />
              {errors.parkingAvenueId && (
                <p className="text-red-500 text-[10px]">
                  {errors.parkingAvenueId.message}
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
      {/* Edit Avenue Form */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-xl overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Parking Location</DialogTitle>{" "}
            <DialogDescription>Modify parking location</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmitAvenue(onAvenueSubmit)}
            className=" w-full"
          >
            <div className="pt-2 flex gap-5 md: justify-between items-center w-full">
              <div className=" w-full">
                <Label htmlFor="name" className="mb-1">
                  Name
                </Label>
                <Input {...registerAvenue("name")} id="name" />
                {avenueErrors.name && (
                  <p className="text-red-500 text-[10px]">
                    {avenueErrors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-2 flex gap-5 items-center">
              <div className=" w-full">
                <Label htmlFor="workingHours" className="mb-1">
                  Working Hours
                </Label>
                <div className="flex items-center gap-2">
                  <div>
                    <Input
                      type="time"
                      {...registerAvenue("startTime")}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div>
                    <Input
                      type="time"
                      {...registerAvenue("endTime")}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <Input
                  {...registerAvenue("workingHrs")}
                  id="workingHours"
                  className=" hidden"
                />
                {avenueErrors.workingHrs && (
                  <p className="text-red-500 text-[10px]">
                    {avenueErrors.workingHrs.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  {...registerAvenue("hourlyRate")}
                  type="number"
                  id="hourlyRate"
                />
                {avenueErrors.hourlyRate && (
                  <p className="text-red-500 text-[10px]">
                    {avenueErrors.hourlyRate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-5 items-center">
              <div className=" w-full">
                <Label htmlFor="totalSpots">Total Spots</Label>
                <Input
                  {...registerAvenue("totalSpots")}
                  type="number"
                  id="totalSpots"
                />
                {avenueErrors.totalSpots && (
                  <p className="text-red-500 text-[10px]">
                    {avenueErrors.totalSpots.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={controlAvenue}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          avenueErrors.status ? "border-destructive w-full" : "w-full"
                        }
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">OPEN</SelectItem>
                        <SelectItem value="CLOSED">CLOSED</SelectItem>
                        <SelectItem value="FULL">FULL</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className=" flex items-center justify-between my-2 gap-5">
              <div className="w-full">
                <Label htmlFor="currentSpots">Current Spots</Label>
                <Input
                  {...registerAvenue("currentSpots")}
                  type="number"
                  id="currentSpots"
                />
                {avenueErrors.currentSpots && (
                  <p className="text-red-500 text-[10px]">
                    {avenueErrors.currentSpots.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPendingAvenue}
                  onClick={() => resetAvenue()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Editing...
                  </>
                ) : (
                  "Edit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ParkingLocationCard;
