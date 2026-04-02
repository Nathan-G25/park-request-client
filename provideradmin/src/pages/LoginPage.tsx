import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
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
      <div className=" w-sm flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg px-5 py-8 z-30 backdrop-saturate-150">
        <h1 className=" mt-3 px-4 py-2 bg-linear-to-b from-[#8958F2] to-[#1326F5] text-xl text-center text-white font-black rounded-lg shadow-md">
          P
        </h1>
        <div className=" flex flex-col items-center justify-center pt-2">
          <h2 className=" text-3xl text-center">Welcome back</h2>
          <p className=" text-gray-600 text-xs pt-2">Glad to see you again👋</p>
          <p className=" text-gray-600 text-xs">Login to your account below</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-start pt-5"
        >
          <div className=" mb-4 w-full">
            <label
              htmlFor="username"
              className=" block font-medium text-xs text-gray-700 pb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3 w-full">
            <label
              htmlFor="password"
              className="block font-medium text-xs text-gray-700 pb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Dynamic type
                id="password"
                className="w-full pl-3 pr-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          <a
            href="/resetpassword"
            className=" text-blue-500 hover:underline text-xs text-end w-full pb-2"
          >
            Forgot Password?
          </a>
          <button
            disabled={isPending}
            type="submit"
            className=" font-light w-full bg-linear-to-b from-[#8958F2] to-[#1326F5] text-white py-2 px-4 rounded-lg shadow-md backdrop-blur-lg hover:cursor-pointer"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          {isError && (
            <p className=" text-red-500 text-xs pt-2"> {error?.message} </p>
          )}
        </form>
        <div className=" flex items-center gap-1 text-xs text-gray-500 pt-3">
          <p>Don't have an account?</p>
          <a href="/signup" className=" text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
