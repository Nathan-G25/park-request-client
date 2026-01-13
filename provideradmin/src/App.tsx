import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import LoginPage from "./pages/LoginPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./utils/AuthProvider.tsx";
import Layout from "./Layout";
import Home from "./pages/Home.tsx";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            //This will be the dashboard and main layout route
            <Route element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
