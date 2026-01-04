import { useEffect, useState } from "react";
import api from "../api";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    api.get("/employee/dashboard/")
      .then(res => {
        setStats(res.data.stats);
        setAssets(res.data.assigned_assets);
      })
        .catch((err) => {
      console.error("Employee dashboard API error:", err);
    });;
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="emp-dashboard">
      <h2 className="page-title">Employee Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p>My Assets</p>
          <h1>{stats.my_assets}</h1>
        </div>

        <div className="stat-card">
          <p>Active Tickets</p>
          <h1>{stats.active_tickets}</h1>
        </div>

        <div className="stat-card">
          <p>Resolved Tickets</p>
          <h1>{stats.resolved_tickets}</h1>
        </div>
      </div>

      <div className="asset-box">
        <h3>My Assigned Assets</h3>
        <ul className="asset-list">
          {assets.map((item, index) => (
            <li key={index}>
              <span>{item.asset_name}</span>
              <small>
                Assigned {new Date(item.assigned_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
