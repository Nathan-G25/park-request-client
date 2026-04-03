import ParkingAvenuesTable from "@/components/ParkingAvenuesTable";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddParkingAvenue } from "@/hooks/useAddParkingAvenue";
import { createParkingAvenueSchema, type CreateParkingAvenue } from "@/schema";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Check, ChevronsUpDown, LocateFixed } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

export const SUBCITY = [
  "ADDISKETEMA",
  "AKAKYKALITI",
  "ARADA",
  "BOLE",
  "GULLELE",
  "KIRKOS",
  "KOLFEKERANIO",
  "LIDETA",
  "NIFASSILKLAFTO",
  "YEKA",
  "LEMIKURA",
] as const;

// Helper component to draw the line between two points
const MapPolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        strokeColor: "#3b82f6",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });
    }
    polylineRef.current.setMap(map);
    polylineRef.current.setPath(path);

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map, path]);

  return null;
};

const MapPicker = ({
  onLocationSelect,
  currentPos,
  endPos,
  locationType,
}: {
  onLocationSelect: (
    lat: number | null,
    lng: number | null,
    type: "start" | "end",
  ) => void;
  currentPos?: { lat: number; lng: number } | null;
  endPos?: { lat: number; lng: number } | null;
  locationType: string;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && currentPos && !endPos) {
      map.panTo(currentPos);
    }
  }, [map, currentPos, endPos]);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail.latLng) {
        const { lat, lng } = e.detail.latLng;

        if (locationType === "OFF_STREET") {
          onLocationSelect(lat, lng, "start");
        } else {
          // ON_STREET logic: toggle between setting start and end points
          if (!currentPos) {
            onLocationSelect(lat, lng, "start");
          } else if (currentPos && !endPos) {
            onLocationSelect(lat, lng, "end");
          } else {
            // If both exist, reset and start a new line
            onLocationSelect(lat, lng, "start");
            onLocationSelect(null, null, "end");
          }
        }
      }
    },
    [locationType, currentPos, endPos, onLocationSelect],
  );

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude, "start");
        if (map) map.panTo({ lat: latitude, lng: longitude });
      });
    } else {
      toast.error("Browser does not support geolocation");
    }
  };

  return (
    <div className="relative w-full h-60 rounded-md border overflow-hidden mt-2">
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: 9.0227, lng: 38.7468 }} // Center on Addis Ababa
        mapId={MAP_ID}
        onClick={handleMapClick}
        disableDefaultUI
        gestureHandling="greedy"
      >
        {currentPos && (
          <AdvancedMarker position={currentPos}>
            <Pin background={"#000"} glyphColor={"#fff"} borderColor={"#000"} />
          </AdvancedMarker>
        )}

        {endPos && locationType === "ON_STREET" && (
          <AdvancedMarker position={endPos}>
            {/* Using a red pin for the end point to distinguish it */}
            <Pin
              background={"#ef4444"}
              glyphColor={"#fff"}
              borderColor={"#ef4444"}
            />
          </AdvancedMarker>
        )}

        {currentPos && endPos && locationType === "ON_STREET" && (
          <MapPolyline path={[currentPos, endPos]} />
        )}
      </Map>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 shadow-md"
        onClick={handleUseCurrentLocation}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ParkingAvenues = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddParkingAvenue();
  const [addressOpen, setAddressOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createParkingAvenueSchema),
    defaultValues: {
      type: "OFF_STREET",
    },
  });

  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "et" } },
    debounce: 300,
    callbackName: "initMap",
  });

  const locationType = watch("type");
  const watchedLat = watch("latitude") as string;
  const watchedLng = watch("longitude") as string;
  const watchedEndLat = watch("endLatitude") as string;
  const watchedEndLng = watch("endLongitude") as string;
  const subcityValue = watch("subCity");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Format working hours
  useEffect(() => {
    if (startTime && endTime) {
      setValue("workingHrs", `${startTime} - ${endTime}`);
    }
  }, [startTime, endTime, setValue]);

  // Clear end points if switched back to OFF_STREET
  useEffect(() => {
    if (locationType === "OFF_STREET") {
      setValue("endLatitude", "");
      setValue("endLongitude", "");
    }
  }, [locationType, setValue]);

  const currentPos =
    watchedLat && watchedLng
      ? { lat: parseFloat(watchedLat), lng: parseFloat(watchedLng) }
      : null;

  const endPos =
    watchedEndLat && watchedEndLng
      ? { lat: parseFloat(watchedEndLat), lng: parseFloat(watchedEndLng) }
      : null;

  const handleLocationSelect = (
    lat: number | null,
    lng: number | null,
    type: "start" | "end",
  ) => {
    if (type === "start") {
      setValue("latitude", lat ? lat.toFixed(6) : "");
      setValue("longitude", lng ? lng.toFixed(6) : "");
    } else {
      setValue("endLatitude", lat ? lat.toFixed(6) : "");
      setValue("endLongitude", lng ? lng.toFixed(6) : "");
    }
  };

  const handleAddressSelect = async (description: string) => {
    setSearchValue(description, false);
    setAddressOpen(false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(results[0]);
      handleLocationSelect(lat, lng, "start");
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const onSubmit = (data: CreateParkingAvenue) => {
    mutate(data, {
      onSuccess: (resData) => {
        toast.success(resData.message || "Parking Avenue Created Successfully");
        reset();
        setOpen(false);
      },
    });
  };

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Parking Location</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Parking Location</DialogTitle>{" "}
              <DialogDescription>
                Create a new on-street or off-street parking location
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className=" w-full">
              <APIProvider apiKey={API_KEY} libraries={["places", "geometry"]}>
                <div className="pt-2 flex gap-5 md:justify-between items-center w-full">
                  <div className=" w-full">
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
                  <div className=" w-full">
                    <Label htmlFor="locationType" className="mb-1">
                      Location Type
                    </Label>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={
                              errors.type
                                ? "border-destructive w-full"
                                : "w-full"
                            }
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ON_STREET">On-Street</SelectItem>
                            <SelectItem value="OFF_STREET">
                              Off-Street
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-red-500 text-[10px]">
                        {String(errors.type.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" pt-2 flex gap-5 md:justify-between items-center w-full">
                  <div className="w-full">
                    <Label htmlFor="username" className="mb-1">
                      Owner Username
                    </Label>
                    <Input
                      {...register("username")}
                      id="username"
                      placeholder="e.g. nathan123"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-[10px]">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
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

                <div className="space-y-1 pt-2">
                  <Label>Pin Location</Label>
                  <Popover open={addressOpen} onOpenChange={setAddressOpen}>
                    <PopoverTrigger asChild>
                      {ready && (
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full justify-between font-normal text-muted-foreground`}
                          disabled={!ready}
                        >
                          {searchValue || "Search map for address..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0 z-50"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search address..."
                          value={searchValue}
                          onValueChange={(val) => setSearchValue(val)}
                        />
                        <CommandList>
                          {status === "OK" && (
                            <CommandGroup>
                              {data.map(({ place_id, description }) => (
                                <CommandItem
                                  key={place_id}
                                  value={description}
                                  onSelect={() =>
                                    handleAddressSelect(description)
                                  }
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${watch("address") === description ? "opacity-100" : "opacity-0"}`}
                                  />
                                  {description}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <MapPicker
                    onLocationSelect={handleLocationSelect}
                    currentPos={currentPos}
                    endPos={endPos}
                    locationType={locationType}
                  />
                  {locationType === "ON_STREET" && (
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Click twice on the map to mark the start and end of the
                      street parking.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex gap-5 items-center">
                  <div className=" w-full">
                    <Label htmlFor="latitude" className="mb-1">
                      {locationType === "ON_STREET"
                        ? "Start Latitude"
                        : "Latitude"}
                    </Label>
                    <Input
                      {...register("latitude")}
                      id="latitude"
                      readOnly
                      placeholder="Select on Map"
                      className="text-gray-400"
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-[10px]">
                        {errors.latitude.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <Label htmlFor="longitude" className="mb-1">
                      {locationType === "ON_STREET"
                        ? "Start Longitude"
                        : "Longitude"}
                    </Label>
                    <Input
                      {...register("longitude")}
                      id="longitude"
                      readOnly
                      placeholder="Select on Map"
                      className="text-gray-400"
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-[10px]">
                        {errors.longitude.message}
                      </p>
                    )}
                  </div>
                </div>

                {locationType === "ON_STREET" && (
                  <div className="pt-2 flex gap-5 items-center">
                    <div className=" w-full">
                      <Label htmlFor="endLatitude" className="mb-1">
                        End Latitude
                      </Label>
                      <Input
                        {...register("endLatitude")}
                        id="endLatitude"
                        readOnly
                        placeholder="Select on Map"
                        className="text-gray-400"
                      />
                    </div>
                    <div className=" w-full">
                      <Label htmlFor="endLongitude" className="mb-1">
                        End Longitude
                      </Label>
                      <Input
                        {...register("endLongitude")}
                        id="endLongitude"
                        readOnly
                        placeholder="Select on Map"
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-5 items-center">
                  <div className=" w-full">
                    <Label htmlFor="workingHours" className="mb-1">
                      Working Hours
                    </Label>
                    <div className="flex items-center gap-2">
                      <div>
                        <Input
                          type="time"
                          {...register("startTime")}
                          className="cursor-pointer"
                        />
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <div>
                        <Input
                          type="time"
                          {...register("endTime")}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <Input
                      {...register("workingHrs")}
                      id="workingHours"
                      className=" hidden"
                    />
                    {errors.workingHrs && (
                      <p className="text-red-500 text-[10px]">
                        {errors.workingHrs.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                      {...register("hourlyRate")}
                      type="number"
                      id="hourlyRate"
                    />
                    {errors.hourlyRate && (
                      <p className="text-red-500 text-[10px]">
                        {errors.hourlyRate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-5 items-center">
                  <div className=" w-full">
                    <Label htmlFor="totalSpots">Total Spots</Label>
                    <Input
                      {...register("totalSpots")}
                      type="number"
                      id="totalSpots"
                    />
                    {errors.totalSpots && (
                      <p className="text-red-500 text-[10px]">
                        {errors.totalSpots.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={
                              errors.status
                                ? "border-destructive w-full"
                                : "w-full"
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
                      {...register("currentSpots")}
                      type="number"
                      id="currentSpots"
                    />
                    {errors.currentSpots && (
                      <p className="text-red-500 text-[10px]">
                        {errors.currentSpots.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 w-full">
                    <label className="block font-medium text-xs text-gray-700 pb-1">
                      Subcity
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setValue("subCity", value as (typeof SUBCITY)[number])
                      }
                      value={subcityValue}
                    >
                      <SelectTrigger className="h-8.5 text-xs border-gray-300 focus:ring-blue-500 w-full">
                        <SelectValue placeholder="Select subcity" />
                      </SelectTrigger>
                      <SelectContent className=" uppercase">
                        {SUBCITY.map((scity) => (
                          <SelectItem
                            key={scity}
                            value={scity}
                            className="text-xs uppercase"
                          >
                            {scity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subCity && (
                      <p className="text-red-500 text-[10px]">
                        {errors.subCity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <Label htmlFor="legalDocument">Legal Document</Label>
                  <Input
                    {...register("legalDoc", {
                      required: "Legal document is required",
                      validate: {
                        notEmpty: (value) => {
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
              </APIProvider>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <section className=" mt-8 w-full">
        <ParkingAvenuesTable />
      </section>
    </main>
  );
};

export default ParkingAvenues;
