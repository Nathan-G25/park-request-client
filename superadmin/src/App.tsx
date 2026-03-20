import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import Overview from "./pages/Overview";
import Providers from "./pages/Providers";
import Wardens from "./pages/Wardens";
import Reservations from "./pages/Reservations";
import Analytics from "./pages/Analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./utils/AuthProvider";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import ParkingAvenues from "./pages/ParkingAvenues";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* dashboard */}
            <Route element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/parking-avenues" element={<ParkingAvenues/>} />
              <Route path="/wardens" element={<Wardens />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
