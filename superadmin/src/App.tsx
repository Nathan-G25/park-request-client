import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import Overview from "./pages/Overview";
import Providers from "./pages/Providers";
import Wardens from "./pages/Wardens";
import Reservations from "./pages/Reservations";
import Analytics from "./pages/Analytics";
import AuditLogs from "./pages/AuditLogs";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/wardens" element={<Wardens />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
