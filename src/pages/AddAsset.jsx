import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AddAsset.css";

const AddAsset = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "LAPTOP",
    serial_number: "",
    status: "AVAILABLE",
    purchase_date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("assets/", form);
      alert("Asset added successfully");
      navigate("/assets");
    } catch (error) {
      console.error("Add asset error:", error.response?.data || error.message);

      // ✅ Show Django validation error properly
      if (error.response?.data) {
        const msg = Object.values(error.response.data)[0];
        alert(Array.isArray(msg) ? msg[0] : msg);
      } else {
        alert("Failed to add asset");
      }
    }
  };

  return (
    <div className="add-asset-container">
      <h2 className="add-asset-title">Add Asset</h2>

      <form className="add-asset-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Asset Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="serial_number"
          placeholder="Serial Number"
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

        <button className="add-asset-btn">Save Asset</button>
      </form>
    </div>
  );
};

export default AddAsset;
