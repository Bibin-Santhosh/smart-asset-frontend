import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaLaptop,
  FaClipboardList,
  FaBoxes,
  FaTools,
  FaUser,
  FaUsers,
  FaBug,
  FaTicketAlt,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

import "./Sidebar.css";

/* Get role from JWT */
function getUserRole() {
  const token = localStorage.getItem("access"); // ✅ FIXED KEY
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role; // ADMIN | EMPLOYEE | TECHNICIAN
  } catch {
    return null;
  }
}

function Sidebar() {
  const role = getUserRole();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaLaptop />
        <span>Asset Manager</span>
      </div>

      <nav className="sidebar-menu">

        {/* ================= ADMIN ================= */}
        {role === "ADMIN" && (
          <>
            <NavLink to="/dashboard" className="link">
              <FaTachometerAlt /> Dashboard
            </NavLink>

            <NavLink to="/assets" className="link">
              <FaLaptop /> Assets
            </NavLink>

            <NavLink to="/assignments" className="link">
              <FaClipboardList /> Assignments
            </NavLink>

            <NavLink to="/inventory" className="link">
              <FaBoxes /> Inventory
            </NavLink>

            <NavLink to="/tickets" className="link">
              <FaTools /> Tickets
            </NavLink>

            <NavLink to="/users" className="link">
              <FaUsers /> Users
            </NavLink>
          </>
        )}

        {/* ================= EMPLOYEE ================= */}
        {role === "EMPLOYEE" && (
          <>
            <NavLink to="/employee-dashboard" className="link">
              <FaTachometerAlt /> Dashboard
            </NavLink>

            <NavLink to="/report-issue" className="link">
              <FaBug /> Report Issue
            </NavLink>

            <NavLink to="/employee-assignments" className="link">
              <FaClipboardList /> Assignments
            </NavLink>

            <NavLink to="/employee-tickets" className="link">
              <FaTicketAlt /> My Tickets
            </NavLink>
          </>
        )}

        {/* ================= TECHNICIAN ================= */}
        {role === "TECHNICIAN" && (
          <>
            <NavLink to="/technician-dashboard" className="link">
              <FaTachometerAlt /> Dashboard
            </NavLink>

            <NavLink to="/tickets" className="link">
              <FaTools /> Assigned Tickets
            </NavLink>
          </>
        )}

        {/* ================= COMMON ================= */}
        <NavLink to="/profile" className="link">
          <FaUser /> Profile
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;
