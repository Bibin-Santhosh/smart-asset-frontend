import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./ViewAsset.css";

const ViewAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const res = await api.get(`assets/${id}/`);
        setAsset(res.data);
      } catch (error) {
        console.error(
          "Load asset error:",
          error.response?.data || error.message
        );
        alert("Failed to load asset");
      }
    };

    loadAsset();
  }, [id]);

  if (!asset) return <p>Loading...</p>;

  return (
    <div className="view-asset-container">
      <h2 className="view-asset-title">View Asset</h2>

      <div className="view-asset-row">
        <span className="view-asset-label">Name</span>
        <span className="view-asset-value">{asset.name}</span>
      </div>

      <div className="view-asset-row">
        <span className="view-asset-label">Type</span>
        <span className="view-asset-value">{asset.type}</span>
      </div>

      <div className="view-asset-row">
        <span className="view-asset-label">Serial Number</span>
        <span className="view-asset-value">{asset.serial_number}</span>
      </div>

      <div className="view-asset-row">
        <span className="view-asset-label">Status</span>
        <span className="view-asset-value">{asset.status}</span>
      </div>

      <div className="view-asset-row">
        <span className="view-asset-label">Purchase Date</span>
        <span className="view-asset-value">{asset.purchase_date}</span>
      </div>

      <button
        className="view-asset-btn"
        onClick={() => navigate("/assets")}
      >
        Back to Assets
      </button>
    </div>
  );
};

export default ViewAsset;
