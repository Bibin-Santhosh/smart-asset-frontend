import { useEffect, useMemo, useState } from "react";
import api from "../api";
import "./EmployeeAssignments.css";

function EmployeeAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("asset");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    api.get("employee/assignments/")
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Employee assignments error:", err);
        setLoading(false);
      });
  }, []);

  const filteredAndSorted = useMemo(() => {
    let data = [...assignments];

    // 🔍 Search
    if (search) {
      data = data.filter((a) =>
        a.asset.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔃 Sort
    data.sort((a, b) => {
      let valA, valB;

      if (sortBy === "asset") {
        valA = a.asset.toLowerCase();
        valB = b.asset.toLowerCase();
      } else if (sortBy === "status") {
        valA = a.status;
        valB = b.status;
      } else {
        valA = new Date(a.assigned_date);
        valB = new Date(b.assigned_date);
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [assignments, search, sortBy, order]);

  if (loading) return <p>Loading assignments...</p>;

  return (
    <div className="assignments-page">
      <h2>Assignments</h2>

      {/* 🔧 Toolbar */}
      <div className="assignments-toolbar">
        <input
          type="text"
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="asset">Asset</option>
          <option value="status">Status</option>
          <option value="assigned_date">Assigned Date</option>
        </select>

        <button
          onClick={() =>
            setOrder(order === "asc" ? "desc" : "asc")
          }
        >
          {order === "asc" ? "ASC ↑" : "DESC ↓"}
        </button>
      </div>

      {/* 📋 Table */}
      <div className="assignments-card">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Status</th>
              <th>Assigned Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((a) => (
                <tr key={a.id}>
                  <td data-label="Asset">{a.asset}</td>

                  <td data-label="Status">
                    <span
                      className={`status-badge ${
                        a.status === "ACTIVE"
                          ? "status-active"
                          : "status-returned"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td data-label="Assigned Date">
                    {new Date(a.assigned_date).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeAssignments;
