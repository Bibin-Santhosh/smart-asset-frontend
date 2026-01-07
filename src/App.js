import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import Assignments from "./pages/Assignments";
import AddAssignment from "./pages/AddAssignment";
import AddAsset from "./pages/AddAsset";
import ViewAsset from "./pages/ViewAsset";
import EditAsset from "./pages/EditAsset";
import AddInventory from "./pages/AddInventory";
import EditInventory from "./pages/EditInventory";
import ReportIssue from "./pages/ReportIssue";
import Users from "./pages/Users";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import EmployeeAssignments from "./pages/EmployeeAssignments";
import EmployeeTickets from "./pages/EmployeeTickets";

import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

/* Layout wrapper for authenticated pages */
function Layout({ children }) {
  return (
    <>
      <Header />

      <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px", background: "#f1f5f9" }}>
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Login (Public) */}
        <Route path="/" element={<Login />} />

        {/* 👑 ADMIN DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📦 ASSETS */}
        <Route
          path="/assets"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <Assets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <AddAsset />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/view/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <ViewAsset />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <EditAsset />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📦 INVENTORY */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <AddInventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <EditInventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 🎫 TICKETS */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRoles={["ADMIN","TECHNICIAN"]}>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📋 ASSIGNMENTS */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <Assignments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <AddAssignment />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 👥 USERS */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 👤 PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "TECHNICIAN"]}>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 👨‍💼 EMPLOYEE */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-assignments"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout>
                <EmployeeAssignments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-tickets"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout>
                <EmployeeTickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout>
                <ReportIssue />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 🧑‍🔧 TECHNICIAN */}
        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <Layout>
                <TechnicianDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
