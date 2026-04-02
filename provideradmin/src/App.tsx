import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import LoginPage from "./pages/LoginPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./utils/AuthProvider.tsx";
import Layout from "./Layout";
import Home from "./pages/Home.tsx";
import ParkingAssetPage from "./pages/ParkingAssetPage.tsx";
import WardensPage from "./pages/WardensPage.tsx";
import LiveOpsPage from "./pages/LiveOpsPage.tsx";
import ReservationsPage from "./pages/ReservationsPage.tsx";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { Toaster } from "react-hot-toast"
import ResetPassword from "./pages/ResetPassword.tsx";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/resetpassword" element={<ResetPassword />} />

            {/* //This will be the dashboard and main layout route */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="assets" element={<ParkingAssetPage />} />
              <Route path="wardens" element={<WardensPage />} />
              <Route path="live-ops" element={<LiveOpsPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
