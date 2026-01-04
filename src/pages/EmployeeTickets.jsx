import { useEffect, useMemo, useState } from "react";
import api from "../api";
import "./EmployeeTickets.css";
import { useNavigate } from "react-router-dom";

function EmployeeTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("opened_on");
  const [order, setOrder] = useState("desc");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("employee/tickets/")
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Employee tickets error:", err);
        setLoading(false);
      });
  }, []);

  const filteredAndSorted = useMemo(() => {
    let data = [...tickets];

    // 🔍 Search
    if (search) {
      data = data.filter(
        (t) =>
          t.asset.toLowerCase().includes(search.toLowerCase()) ||
          t.issue.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔃 Sort
    data.sort((a, b) => {
      let valA, valB;

      if (sortBy === "status") {
        valA = a.status;
        valB = b.status;
      } else {
        valA = new Date(a.opened_on);
        valB = new Date(b.opened_on);
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [tickets, search, sortBy, order]);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="tickets-page">
      <h2>Repair Tickets</h2>

      {/* Toolbar */}
      <div className="tickets-toolbar">
        <input
          type="text"
          placeholder="Search issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="opened_on">Created</option>
          <option value="status">Status</option>
        </select>

        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
          {order === "asc" ? "ASC ↑" : "DESC ↓"}
        </button>

        <button
          className="raise-btn"
          onClick={() => navigate("/report-issue")}
        >
          RAISE TICKET
        </button>
      </div>

      {/* Table */}
      <div className="tickets-card">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Opened On</th>
              <th>Assigned On</th>
              <th>Resolved On</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((t) => (
                <tr key={t.id}>
                  <td>{t.asset}</td>
                  <td>{t.issue}</td>

                  <td>
                    <span className={`ticket-status ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>

                  <td>{t.technician || "—"}</td>
                  <td>{new Date(t.opened_on).toLocaleString()}</td>
                  <td>{t.assigned_on ? new Date(t.assigned_on).toLocaleString() : "—"}</td>
                  <td>{t.resolved_on ? new Date(t.resolved_on).toLocaleString() : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTickets;
