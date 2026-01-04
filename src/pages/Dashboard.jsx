import { useEffect, useState } from "react";
import api from "../api";
import "../Dashboard.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

import {
  FaLaptop, FaBoxes, FaUserCheck,
  FaExclamationTriangle, FaTools
} from "react-icons/fa";

const COLORS = ["#3f3cfb", "#f59e0b", "#22c55e"];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get("dashboard/")
      .then(res => setStats(res.data))
      
      .catch(() => alert("Failed to load dashboard"));

    api.get("recent-activity/")
      .then(res => setActivity(res.data))
      .catch(() => {});
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  /* ===== CHART DATA ===== */

  const assetChart = [
    { name: "AVAILABLE", count: stats.assets_status?.AVAILABLE || 0 },
    { name: "ASSIGNED", count: stats.assets_status?.ASSIGNED || 0 },
    { name: "UNDER_REPAIR", count: stats.assets_status?.UNDER_REPAIR || 0 },
  ];

  const ticketChart = [
    { name: "Open", value: stats.tickets_status?.OPEN || 0 },
    { name: "In Progress", value: stats.tickets_status?.IN_PROGRESS || 0 },
    { name: "Closed", value: stats.tickets_status?.CLOSED || 0 },
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* ===== STATS CARDS ===== */}
      <div className="cards">
        <StatCard title="Total Assets" value={stats.total_assets} icon={<FaLaptop />} />
        <StatCard title="Inventory Items" value={stats.total_inventory} icon={<FaBoxes />} />
        <StatCard title="Assigned Assets" value={stats.assigned_assets} icon={<FaUserCheck />} />
        <StatCard title="Low Stock Items" value={stats.low_stock} icon={<FaExclamationTriangle />} />
        <StatCard title="Open Tickets" value={stats.open_tickets} icon={<FaTools />} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="charts">
        {/* Assets Bar Chart */}
        <div className="chart-box">
          <h3>Assets Overview</h3>
          <BarChart width={520} height={300} data={assetChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#dc1c46" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

        {/* Tickets Pie Chart */}
        <div className="chart-box">
          <h3>Tickets Status</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={ticketChart}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
            >
              {ticketChart.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="activity-box">
        <h3 className="activity-title">Recent Activity</h3>

        {activity.length === 0 && (
          <p className="no-activity">No recent activity</p>
        )}

        {activity.map((item, index) => (
          <div key={index} className="activity-item">
            <span className="activity-text">{item.message}</span>
            <span className="activity-time">
              {new Date(item.time).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== STAT CARD ===== */
function StatCard({ title, value, icon }) {
  return (
    <div className="card">
      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
      <div className="icon">{icon}</div>
    </div>
  );
}

export default Dashboard;
