import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/schema";
import toast from "react-hot-toast";
import { useAddOwner } from "@/hooks/useAddOwner";
import ProviderTable from "@/components/ProviderTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Providers = () => {
  const { mutate, isPending } = useAddOwner();

  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
  // console.log("📁 personalId type:", typeof data.personalld);
  // console.log("📁 personalId instanceof FileList:", data.personalld instanceof FileList);
  // console.log("📁 personalId length:", data.personalld?.length);
  // if (data.personalld?.[0]) {
  //   console.log("📁 File name:", data.personalld[0].name);
  //   console.log("📁 File size:", data.personalld[0].size);
  //   console.log("📁 File type:", data.personalld[0].type);
  // }
  mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message || "Provider Created Successfully");
        // reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  
  // reset();
};

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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <span>+</span>
              <span>Add New Provider</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Parking Provider</DialogTitle>{" "}
              <DialogDescription>
                Create a new parking provider
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-start pt-2"
            >
              <div className=" flex gap-5 items-center">
                <div className=" mb-4 w-full">
                  <label
                    htmlFor="firstName"
                    className=" block font-medium text-xs text-gray-700 pb-1"
                  >
                    FirstName
                  </label>
                  <input
                    {...register("firstName")}
                    type="text"
                    id="firstName"
                    className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-[10px]">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className=" mb-4 w-full">
                  <label
                    htmlFor="lastName"
                    className=" block font-medium text-xs text-gray-700 pb-1"
                  >
                    LastName
                  </label>
                  <input
                    {...register("lastName")}
                    type="text"
                    id="lastName"
                    className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-[10px]">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" flex items-center gap-5">
                <div className=" mb-4 w-full">
                  <label
                    htmlFor="username"
                    className=" block font-medium text-xs text-gray-700 pb-1"
                  >
                    Username
                  </label>
                  <input
                    {...register("username")}
                    type="text"
                    id="username"
                    className=" w-full px-3 py-1 border border-gray-300 bg-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                    placeholder="Enter username"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className=" mb-4 w-full">
                  <label
                    htmlFor="email"
                    className=" block font-medium text-xs text-gray-700 pb-1"
                  >
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" flex items-center gap-5 w-full">
                <div className=" mb-4 w-full">
                  <label
                    htmlFor="phoneNo"
                    className=" block font-medium text-xs text-gray-700 pb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phoneNo")}
                    type="text"
                    id="phoneNo"
                    className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNo && (
                    <p className="text-red-500 text-[10px]">
                      {errors.phoneNo.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block font-medium text-xs text-gray-700 pb-1">
                  Personal ID (Image)
                </label>

                <Controller
                  name="personalId"
                  control={control}
                  render={({
                    field: { onChange, value, ref },
                    fieldState: { error },
                  }) => (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        className="text-xs"
                      />
                      {value && value.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {value[0].name}
                        </p>
                      )}
                      {error && (
                        <p className="text-red-500 text-[10px]">
                          {String(error.message)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <DialogFooter className="mt-2 flex justify-end items-end w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    // onClick={() => reset()}
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
      </header>
      <section className=" mt-8 w-full">
        <ProviderTable />
      </section>
    </main>
  );
};

export default Providers;
