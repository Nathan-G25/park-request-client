import { editWardenSchema, type EditWarden, type Warden } from "@/schema";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { MapPin, MoreVertical, Phone, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditWarden } from "@/hooks/useEditWarden";
import { toast } from "react-hot-toast";
import { useDeleteWarden } from "@/hooks/useDeleteWarden";

interface WardenCardProps {
  warden: Warden;
}

const WardenCard = ({ warden }: WardenCardProps) => {
  const statusStyle =
    {
      ONDUTY: "bg-green-100 text-green-600",
      OFFDUTY: "bg-gray-100 text-gray-600",
    }[warden.wardenStatus] ?? "bg-gray-100 text-gray-600";

  const statusDotColor =
    {
      ONDUTY: "bg-green-400",
      OFFDUTY: "bg-gray-400",
    }[warden.wardenStatus] ?? "bg-gray-400";

  const initials =
    `${warden.firstName?.[0] ?? ""}${warden.lastName?.[0] ?? ""}`.toUpperCase() ||
    "JD";
  const fullName =
    [warden.firstName, warden.lastName].filter(Boolean).join(" ") || "John Doe";

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { mutate, isPending } = useEditWarden(warden.id);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteWarden();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editWardenSchema),
    values: {
      firstName: warden.firstName ?? "",
      lastName: warden.lastName ?? "",
      username: warden.username ?? "",
      phoneNo: warden.phoneNo ?? "",
      gender:
        warden.gender === "MALE" || warden.gender === "FEMALE"
          ? warden.gender
          : "MALE",
      wardenStatus:
        warden.wardenStatus === "ONDUTY" || warden.wardenStatus === "OFFDUTY"
          ? warden.wardenStatus
          : "OFFDUTY",
      residenceArea: warden.residenceArea ?? "",
      parkingAvenueId: warden.parkingAvenueId,
    },
  });

  const onSubmit = (data: EditWarden) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message || "Warden Created Successfully");
        reset();
        setOpen(false);
      },
    });
  };

  const handleDelete = () => {
    deleteMutate(warden.id, {
      onSuccess: () => {
        toast.success("Warden deleted successfully");
        setOpenDelete(false);
      },
      onError: () => {
        toast.error("Failed to delete warden");
      }
    });
  };

  return (
    <div className=" overflow-hidden transtion-all shadow-md hover:shadow-lg py-6 rounded-md w-full">
      <section className=" flex flex-col md:flex-row md:items-center md:justify-between w-full px-6">
        <section className=" flex items-center gap-5">
          <div className=" flex items-end">
            <Avatar className={cn(" size-18 bg-blue-700 z-0 ")}>
              <AvatarFallback className=" font-medium text-center  text-white flex items-center justify-center w-full text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                " size-4 rounded-full -ml-5 mb-1 z-20 border border-white",
                statusDotColor,
              )}
            ></span>
          </div>
          <div className=" flex flex-col justify-center">
            <h3 className=" font-medium">{fullName}</h3>
            <div className=" flex gap-3 items-center">
              <div
                className={cn(
                  "font-medium rounded-full flex gap-2 items-center px-3 py-1",
                  statusStyle,
                )}
              >
                <span
                  className={cn(" size-2 rounded-full", statusDotColor)}
                ></span>
                <p className=" text-sm">{warden.wardenStatus}</p>
              </div>
              {warden.wardenStatus === "ONDUTY" && (
                <span className=" text-gray-500 text-sm">Active Now</span>
              )}
            </div>
            <div className=" flex items-center gap-0.5 pt-2 text-gray-500">
              <MapPin className=" size-4" />
              <p className=" text-xs md:text-sm mr-5 md:mr-2">manuak</p>
              <Phone className=" size-4" />
              <p className=" text-xs md:text-sm">{warden.phoneNo}</p>
            </div>
          </div>
        </section>
        <section className=" flex items-center md:justify-center justify-around pt-3 md:pt-0 gap-5">
          <div className=" hidden ">
            <div className=" flex items-center gap-1">
              <Star className=" size-4 md:size-5 text-yellow-500" />
              <p className=" font-medium md:text-base text-sm">80%</p>
            </div>
            <p className=" text-gray-500 text-xs md:text-sm">
              Reliability Score
            </p>
          </div>
          <div className=" hidden">
            <p className=" font-medium md:text-base text-sm">5</p>
            <p className=" text-xs md:text-sm text-gray-500">
              Shifts this week
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Triggers the dialog*/}
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Edit warden
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDelete(true)}
              >
                Delete warden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Warden</DialogTitle>
            <DialogDescription>Modify warden</DialogDescription>
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
                value={warden.parkingAvenueId}
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
                  onClick={() => {
                    reset();
                  }}
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
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Warden</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{fullName}</strong>? 
              This action cannot be undone and will remove them from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-5 ">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenCard;
