import React, { useEffect, useState } from "react";
import api from "../api";
import "./Tickets.css";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    setError("");

    api.get("tickets/")
      .then((res) => {
        console.log("TICKETS RESPONSE:", res.data); // ✅ debug
        setTickets(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        console.error("STATUS:", err.response?.status);
        console.error("URL:", err.config?.url);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (err.response?.status === 404) {
          setError("Tickets API not found (404).");
        } else if (err.response?.status === 500) {
          setError("Server error while fetching tickets.");
        } else {
          setError("Failed to fetch tickets.");
        }
      })
      .finally(() => setLoading(false));
  };

  const filteredTickets = tickets
    .filter((t) =>
      (t.issue || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      activeTab === "ACTIVE"
        ? t.status !== "CLOSED"
        : t.status === "CLOSED"
    );

  return (
    <div>
      <h2>Repair Tickets</h2>

      {/* 🔍 TOOLBAR */}
      <div className="tickets-toolbar">
        <input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tabs">
          <span
            className={activeTab === "ACTIVE" ? "active" : ""}
            onClick={() => setActiveTab("ACTIVE")}
          >
            ACTIVE TICKETS
          </span>
          <span
            className={activeTab === "HISTORY" ? "active" : ""}
            onClick={() => setActiveTab("HISTORY")}
          >
            HISTORY
          </span>
        </div>
      </div>

      {/* ⏳ LOADING */}
      {loading && <p>Loading tickets...</p>}

      {/* ❌ ERROR */}
      {!loading && error && (
        <p style={{ color: "red", fontWeight: 600 }}>{error}</p>
      )}

      {/* 📋 TABLE */}
      {!loading && !error && (
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Opened On</th>
              <th>Resolved On</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.asset_name || "-"}</td>
                <td>{ticket.issue}</td>
                <td className={`status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </td>
                <td>{ticket.technician || "-"}</td>
                <td>{ticket.opened_on || "-"}</td>
                <td>{ticket.resolved_on || "-"}</td>
              </tr>
            ))}

            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tickets;
