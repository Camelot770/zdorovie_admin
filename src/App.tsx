import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Broadcast from "./pages/Broadcast";
import BroadcastHistory from "./pages/BroadcastHistory";
import Appointments from "./pages/Appointments";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="broadcast" element={<Broadcast />} />
        <Route path="broadcasts" element={<BroadcastHistory />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>
    </Routes>
  );
}
