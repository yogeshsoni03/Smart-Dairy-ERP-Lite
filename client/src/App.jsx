import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import MilkCollection from "./pages/MilkCollection";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/farmers"
          element={<Farmers />}
        />

        <Route
          path="/milk"
          element={<MilkCollection />}
        />

        <Route
          path="/payments"
          element={<Payments />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/staff"
          element={<Staff />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;