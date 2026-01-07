import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./EditAsset.css";

const EditAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "LAPTOP",
    serial_number: "",
    status: "AVAILABLE",
    purchase_date: "",
  });

  /* LOAD ASSET */
  useEffect(() => {
    const loadAsset = async () => {
      try {
        const res = await api.get(`assets/${id}/`);
        setForm(res.data);
      } catch (error) {
        console.error("Load asset error:", error.response?.data || error.message);
        alert("Failed to load asset");
      }
    };

    loadAsset();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`assets/${id}/`, form);
      alert("Asset updated successfully");
      navigate("/assets");
    } catch (error) {
      console.error("Update asset error:", error.response?.data || error.message);

      if (error.response?.data) {
        const msg = Object.values(error.response.data)[0];
        alert(Array.isArray(msg) ? msg[0] : msg);
      } else {
        alert("Failed to update asset");
      }
    }
  };

  return (
    <div className="edit-asset-container">
      <h2 className="edit-asset-title">Edit Asset</h2>

      <form className="edit-asset-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="serial_number"
          value={form.serial_number}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="purchase_date"
          value={form.purchase_date}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="LAPTOP">Laptop</option>
          <option value="KEYBOARD">Keyboard</option>
          <option value="MOUSE">Mouse</option>
          <option value="MONITOR">Monitor</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="AVAILABLE">Available</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="ASSIGNED">Assigned</option>
        </select>

        <div className="edit-asset-actions">
          <button className="edit-asset-btn">Update Asset</button>

          <button
            type="button"
            className="edit-asset-cancel"
            onClick={() => navigate("/assets")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAsset;
