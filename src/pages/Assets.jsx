import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Assets.css";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    axios
      .get("http://127.0.0.1:8000/api/assets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setAssets(res.data))
      .catch(() => alert("Failed to load assets"));
  };

  const deleteAsset = (id) => {
    if (!window.confirm("Delete this asset?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/assets/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => fetchAssets());
  };

  // SEARCH
  const filteredAssets = assets.filter((asset) =>
    `${asset.name} ${asset.serial_number} ${asset.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // SORT
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aVal = a[sortBy]?.toString().toLowerCase();
    const bVal = b[sortBy]?.toString().toLowerCase();
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2>Assets</h2>

      {/* TOP BAR */}
      <div className="assets-top-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search assets..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="sort-box">
          <label>Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
          </select>
        </div>

        <button
          className="sort-btn"
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
        >
          {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
        </button>

        <button
          className="add-asset-btn"
          onClick={() => navigate("/assets/add")}
        >
          ADD ASSET
        </button>
      </div>

      {/* TABLE */}
      <table className="assets-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Serial</th>
            <th>Status</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedAssets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.type}</td>
              <td>{asset.serial_number}</td>
              <td>{asset.status}</td>
              <td>—</td>
              <td>
                <span
                  className="action view"
                  onClick={() => navigate(`/assets/view/${asset.id}`)}
                >
                  VIEW
                </span>
                <span
                  className="action edit"
                  onClick={() => navigate(`/assets/edit/${asset.id}`)}
                >
                  EDIT
                </span>
                <span
                  className="action delete"
                  onClick={() => deleteAsset(asset.id)}
                >
                  DELETE
                </span>
              </td>
            </tr>
          ))}

          {sortedAssets.length === 0 && (
            <tr>
              <td colSpan="6" className="no-data">
                No assets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Assets;
