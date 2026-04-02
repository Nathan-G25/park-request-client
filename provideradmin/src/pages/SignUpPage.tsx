import { useRegisterOwner } from "@/hooks/useRegisterOwner";
import { signUpSchema, type SignUpFormData } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const { mutateAsync, isPending } = useRegisterOwner();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    reset();
    toast.promise(mutateAsync(data), {
      loading: "Uploading your details and ID...",
      success: (res) => `Welcome, ${res.parkingAvenueOwner.username}!`,
      error: (err) => `Registration failed: ${err.message}`,
    });
  };

  return (
    <main className=" flex font-inter items-center justify-center h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
        }}
      />
      <div className=" w-lg flex flex-col  justify-center bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg px-5 py-8 z-30 backdrop-saturate-150">
        {/* <h1 className=" mt-3 w-12 px-4 py-2 bg-linear-to-b from-[#8958F2] to-[#1326F5] text-xl text-center text-white font-black rounded-lg shadow-md">
          P
        </h1> */}
        <div className=" flex flex-col justify-center pt-2">
          <h2 className=" text-4xl">Sign Up</h2>
          <p className=" text-gray-600 text-xs pt-2">
            Enter your details below to create your account and get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-start pt-5"
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
          <div className=" mb-6 w-full">
            <label
              htmlFor="password"
              className=" block font-medium text-xs text-gray-700 pb-1"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-[10px]">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-4 w-full">
            <label className="block font-medium text-xs text-gray-700 pb-1">
              Personal ID (Image)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("personalId")}
              className="text-xs"
            />
            {errors.personalId && (
              <p className="text-red-500 text-[10px]">
                {String(errors.personalId.message)}
              </p>
            )}
          </div>
          <button
            disabled={isPending}
            type="submit"
            className=" w-full bg-linear-to-b from-[#8958F2] to-[#1326F5] text-white py-2 px-4 rounded-lg shadow-md backdrop-blur-lg hover:cursor-pointer disabled:bg-gray-400"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Uploading ID...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
          <div className=" flex items-center gap-1 text-gray-500 text-xs pt-3 justify-center w-full">
            <p>Already have an account?</p>
            <a href="/login" className=" text-blue-500 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUpPage;
