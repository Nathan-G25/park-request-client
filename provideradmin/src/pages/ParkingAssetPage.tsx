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
import {
  createParkingAvenueSchema,
  paginatedAvenueResponseSchema,
  type CreateParkingAvenue,
  type PaginatedParkingAvenues,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ZodError } from "zod";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Check, ChevronsUpDown, LocateFixed } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const fetchParkingAvenues =
  async (): Promise<PaginatedParkingAvenues> => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      throw new Error("No user found");
    }

    const user = JSON.parse(storedUser);
    const token = user.accessToken;

    if (!token) {
      throw new Error("No accesstoken found");
    }

    const response = await fetch("http://localhost:3000/parking-avenue/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Could not fetch profile");
    }
    const normalizedResult = Array.isArray(result)
      ? {
          data: result,
          meta: { nextCursor: null, hasMore: false },
        }
      : {
          ...result,
          meta: {
            nextCursor: result?.meta?.nextCursor ?? null,
            hasMore: Boolean(result?.meta?.hasMore ?? result?.meta?.hasmore),
          },
        };

    try {
      const parsedData = paginatedAvenueResponseSchema.parse(normalizedResult);
      return parsedData;
    } catch (err) {
      if (err instanceof ZodError) {
        console.error("Zod validation failed on API response:", err.message);
      }
      return { data: [], meta: { nextCursor: null, hasMore: false } };
    }
  };

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

// Map picker element in the bottom right corner of the map
const MapPicker = ({
  onLocationSelect,
  currentPos,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  currentPos?: { lat: number; lng: number };
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && currentPos) {
      map.panTo(currentPos);
    }
  }, [map]);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail.latLng) {
        onLocationSelect(e.detail.latLng.lat, e.detail.latLng.lng);
      }
    },
    [onLocationSelect],
  );

  // handles the retrieval of the users current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((postion) => {
        const { latitude, longitude } = postion.coords;
        onLocationSelect(latitude, longitude);
        if (map) map.panTo({ lat: latitude, lng: longitude });
      });
    } else {
      toast.error("Browser does not support geolocation");
    }
  };

  return (
    <div className=" relative w-full h-60 rounded-md border overflow-hidden mt-2">
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: 9.0227, lng: 38.7468 }}
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

const ParkingAssetPage = () => {
  const { data: location, hasNextPage, fetchNextPage, isFetchingNextPage,error } = useInfiniteQuery({
    queryKey: ["parkingAvenues"],
    queryFn: fetchParkingAvenues,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    retry: false,
  });

  if (error) {
    console.error("Error fetching user profile:", error);
  }

  const locations = useMemo(
    () => location?.pages.flatMap((page) => page.data) ?? [],
    [location],
  );

  const { mutate, isPending } = useAddParkingAvenue();
  const [open, setOpen] = useState(false);
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

  const watchedLat = watch("latitude") as string;
  const watchedLng = watch("longitude") as string;

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    if (startTime && endTime) {
      setValue("workingHrs", `${startTime} - ${endTime}`);
    }
  }, [startTime, endTime, setValue]);

  const currentPos =
    watchedLat && watchedLng
      ? { lat: parseFloat(watchedLat), lng: parseFloat(watchedLng) }
      : null;

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue("latitude", lat.toFixed(6));
    setValue("longitude", lng.toFixed(6));
  };

  const handleAddressSelect = async (description: string) => {
    setSearchValue(description, false);
    setAddressOpen(false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(results[0]);
      handleLocationSelect(lat, lng);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const onSubmit = (data: CreateParkingAvenue) => {
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

          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Add Parking Location</DialogTitle>{" "}
              <DialogDescription>
                Create a new parking location
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className=" w-full">
              <APIProvider apiKey={API_KEY} libraries={["places"]}>
                <div className="pt-2 flex gap-5 md: justify-between items-center w-full">
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
                    <Label htmlFor="address" className="mb-1">
                      Address
                    </Label>
                    <Input
                      {...register("address")}
                      className=" "
                      id="address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[10px]">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
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
                          {searchValue || "Select address..."}
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
                          onValueChange={(val) => {
                            setSearchValue(val);
                          }}
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
                    currentPos={currentPos ? currentPos : undefined}
                  />
                </div>

                <div className="pt-2 flex gap-5 items-center">
                  <div className=" w-full">
                    <Label htmlFor="latitude" className="mb-1">
                      Latitude
                    </Label>
                    <Input
                      {...register("latitude")}
                      id="latitude"
                      readOnly
                      placeholder="Select on Map"
                      className=" text-gray-400"
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-[10px]">
                        {errors.latitude.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <Label htmlFor="longitude" className="mb-1">
                      Longitude
                    </Label>
                    <Input
                      {...register("longitude")}
                      id="longitude"
                      readOnly
                      placeholder="Select on Map"
                      className=" text-gray-400"
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-[10px]">
                        {errors.longitude.message}
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

                  <div className="w-full">
                    <Label htmlFor="legalDocument">Legal Document</Label>
                    <Input
                      {...register("legalDoc", {
                        required: "Legal document is required",
                        validate: {
                          notEmpty: (value) => {
                            console.log("File validation:", {
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
      </div>

      {locations &&
        locations.map((loc: (typeof locations)[0]) => (
          <ParkingLocationCard key={loc.id} location={loc} />
        ))}

      <div className="flex flex-col items-center mt-8 pb-10">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Assets"}
          </Button>
        )}

        {!hasNextPage && locations.length > 0 && (
          <p className="text-muted-foreground text-sm">
            You've reached the end of your assets.
          </p>
        )}
      </div>
    </div>
  );
};

export default ParkingAssetPage;
