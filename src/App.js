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
    
      {/* HEADER */}
      <Header />

      {/* BODY (SIDEBAR + CONTENT) */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: "24px", background: "#f1f5f9" }}>
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page (NO layout) */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Assets */}
        <Route
          path="/assets"
          element={
            <Layout>
              <Assets />
            </Layout>
          }
        />

        <Route
          path="/assets/add"
          element={
            <Layout>
              <AddAsset />
            </Layout>
          }
        />

        <Route
          path="/assets/view/:id"
          element={
            <Layout>
              <ViewAsset />
            </Layout>
          }
        />

        <Route
          path="/assets/edit/:id"
          element={
            <Layout>
              <EditAsset />
            </Layout>
          }
        />

        {/* Inventory */}
        <Route
          path="/inventory"
          element={
            <Layout>
              <Inventory />
            </Layout>
          }
        />

        <Route
          path="/inventory/add"
          element={
            <Layout>
              <AddInventory />
            </Layout>
          }
        />

        <Route
          path="/inventory/edit/:id"
          element={
            <Layout>
              <EditInventory />
            </Layout>
          }
        />

        {/* Tickets */}
        <Route
          path="/tickets"
          element={
            <Layout>
              <Tickets />
            </Layout>
          }
        />

        {/* Assignments */}
        <Route
          path="/assignments"
          element={
            <Layout>
              <Assignments />
            </Layout>
          }
        />

        <Route
          path="/assignments/add"
          element={
            <Layout>
              <AddAssignment />
            </Layout>
          }
        />

        {/* ✅ USERS PAGE */}
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        {/* 👨‍💼 Employee Dashboard */}
<Route
  path="/employee-dashboard"
  element={
    <ProtectedRoute allowedRoles={["Employee"]}>
      <Layout>
        <EmployeeDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

{/* 🧑‍🔧 Technician Dashboard */}
<Route
  path="/technician-dashboard"
  element={
    <ProtectedRoute allowedRoles={["Technician"]}>
      <Layout>
        <TechnicianDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/report-issue"
  element={
    <ProtectedRoute allowedRoles={["Employee"]}>
      <Layout>
        <ReportIssue />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/employee-assignments"
  element={
    <ProtectedRoute allowedRoles={["Employee"]}>
      <Layout>
        <EmployeeAssignments />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/employee-tickets"
  element={
    <ProtectedRoute allowedRoles={["Employee"]}>
      <Layout>
        <EmployeeTickets />
      </Layout>
    </ProtectedRoute>
  }
/>




      </Routes>
    </BrowserRouter>
  );
}

export default App;
