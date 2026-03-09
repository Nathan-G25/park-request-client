import { useState } from "react";
import { useLogin } from "../hooks/useLogin";




const LoginPage = () => {

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    login({username, password});
  }

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

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start pt-5">
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
              onChange={(e) => {setUserName(e.target.value)}}
            />
          </div>
          <div className=" mb-6 w-full">
            <label
              htmlFor="password"
              className=" block font-medium text-xs text-gray-700 pb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className=" w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-xs"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
            />
          </div>

          <button disabled={isPending} type="submit" className=" font-light w-full bg-linear-to-b from-[#8958F2] to-[#1326F5] text-white py-2 px-4 rounded-lg shadow-md backdrop-blur-lg hover:cursor-pointer">
            { isPending ? 'Logging in...' : 'Login' }
          </button>
          { isError && <p className=" text-red-500 text-xs pt-2"> { error?.message } </p> }
        </form>
      </div>
    </main>
  );
};

export default LoginPage;

