import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Websites from "./pages/Websites.jsx";
import Forms from "./pages/Forms.jsx";
import ManualForm from "./pages/ManualForm.jsx";
import Leads from "./pages/Leads.jsx";
import Analytics from "./pages/Analytics.jsx";
import { useAuth } from "./providers/AuthProvider.jsx";

const Protected = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  console.log(token);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        <main className="container mx-auto flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Protected />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/websites" element={<Websites />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/forms/manual" element={<ManualForm />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      const API_BASE = "https://3e06cb245a3ddd.lhr.life";
    </Routes>
  );
}
