import { useEffect, useState } from "react";
import api from "../api";
import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("IN_PROGRESS");

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  /* -------------------- LOADERS -------------------- */

  useEffect(() => {
    loadDashboard();
    loadRecentActivity();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("technician/dashboard/");
      setStats(res.data.stats);
      setTickets(res.data.tickets);
    } catch (err) {
      console.error("Technician dashboard error:", err.response?.data || err);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const res = await api.get("technician/recent-activity/");
      setActivity(res.data);
    } catch (err) {
      console.error("Recent activity error:", err.response?.data || err);
    } finally {
      setActivityLoading(false);
    }
  };

  /* -------------------- MODAL -------------------- */

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const updateStatus = async () => {
    try {
      await api.patch(
        `technician/tickets/${selectedTicket.id}/status/`,
        { status }
      );
      closeModal();
      loadDashboard();
      loadRecentActivity();
    } catch (err) {
      console.error("Update status error:", err.response?.data || err);
      alert("Failed to update ticket status");
    }
  };

  /* -------------------- HELPERS -------------------- */

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const getActivityClass = (message) => {
    if (message.includes("CLOSED")) return "green";
    if (message.includes("IN_PROGRESS")) return "orange";
    return "blue";
  };

  /* -------------------- UI -------------------- */

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="tech-dashboard">
      <h2>Technician Dashboard</h2>

      {/* ===== STAT CARDS ===== */}
      <div className="tech-cards">
        <div className="tech-card">
          <p>New Jobs</p>
          <h1>{stats.open}</h1>
          <span>Tickets assigned to you</span>
        </div>

        <div className="tech-card success">
          <p>Resolved</p>
          <h1>{stats.closed}</h1>
          <span>Successfully completed</span>
        </div>
      </div>

      {/* ===== ASSIGNED TICKETS ===== */}
      <div className="tech-section">
        <h3>My Assigned Tickets</h3>

        {tickets.length === 0 && <p>No tickets assigned</p>}

        {tickets.map((t) => (
          <div key={t.id} className="ticket-row">
            <div>
              <strong>{t.asset_name || `Asset #${t.asset}`}</strong>
              <p>{t.issue}</p>
            </div>

            <div className="ticket-actions">
              <span className={`status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
              <button onClick={() => openModal(t)} className="update-btn">
                UPDATE
              </button>
            </div>
          </div>
        ))}
      </div>

      <br />

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="tech-section">
        <h3>Recent Activity</h3>

        {activityLoading && <p className="no-activity">Loading activity...</p>}

        {!activityLoading && activity.length === 0 && (
          <p className="no-activity">No recent activity</p>
        )}

        <div className="activity-list">
          {activity.map((item, index) => (
            <div key={index} className="activity-item">
              <div
                className={`activity-dot ${getActivityClass(item.message)}`}
              />
              <div className="activity-content">
                <p className="activity-message">
                  {item.message.replace(/_/g, " ")}
                </p>
              </div>
              <span className="activity-time">
                {formatTime(item.time)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Ticket Status</h3>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>

            <div className="modal-actions">
              <button className="cancel" onClick={closeModal}>
                CANCEL
              </button>
              <button className="save" onClick={updateStatus}>
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianDashboard;
