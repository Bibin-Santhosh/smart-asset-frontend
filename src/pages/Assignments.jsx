import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    api
      .get("assignments/")
      .then((res) => setAssignments(res.data))
      .catch(() => alert("Failed to load assignments"));
  };

  // 🔍 SEARCH
  const filtered = assignments.filter((a) =>
    `${a.asset_name || a.asset} ${a.employee_name || a.employee}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🔃 SORT BY ASSIGNED DATE
  const sorted = [...filtered].sort((a, b) => {
    const A = new Date(a.date_assigned);
    const B = new Date(b.date_assigned);
    return sortOrder === "asc" ? A - B : B - A;
  });

  // 🔁 RETURN ASSET
  const returnAsset = (id) => {
    if (!window.confirm("Return this asset?")) return;

    api
      .patch(`assignments/${id}/`, { status: "RETURNED" })
      .then(() => fetchAssignments())
      .catch(() => alert("Failed to return asset"));
  };

  return (
    <div>
      <h2>Assignments</h2>

      {/* TOP BAR */}
      <div className="assignments-top-bar">
        <input
          className="assign-search"
          placeholder="Search assignments..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="assign-sort-box">
          <label>Sort by</label>
          <select>
            <option>Assigned Date</option>
          </select>
        </div>

        <button
          className="assign-sort-btn"
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
        >
          {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
        </button>

        <button
          className="assign-add-btn"
          onClick={() => navigate("/assignments/add")}
        >
          ASSIGN ASSET
        </button>
      </div>

      {/* TABLE */}
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>User</th>
            <th>Status</th>
            <th>Assigned Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((a) => (
            <tr key={a.id}>
              <td>{a.asset_name || a.asset}</td>
              <td>{a.employee_name || a.employee}</td>
              <td className={a.status === "ACTIVE" ? "status-active" : "status-returned"}>
                {a.status}
              </td>
              <td>{a.date_assigned}</td>
              <td>
                {a.status === "ACTIVE" ? (
                  <span
                    className="return-action"
                    onClick={() => returnAsset(a.id)}
                  >
                    RETURN
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Assignments;
