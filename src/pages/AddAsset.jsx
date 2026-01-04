import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/assets/", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Asset added successfully");
        navigate("/assets");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data, null, 2));
      });
  };

  return (
    <div className="add-asset-container">
      <h2 className="add-asset-title">Add Asset</h2>

      <form className="add-asset-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Asset Name"
          onChange={handleChange}
          required
        />

        <input
          name="serial_number"
          placeholder="Serial Number"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="purchase_date"
          onChange={handleChange}
          required
        />

        <select name="type" onChange={handleChange}>
          <option value="LAPTOP">Laptop</option>
          <option value="KEYBOARD">Keyboard</option>
          <option value="MOUSE">Mouse</option>
          <option value="MONITOR">Monitor</option>
        </select>

        <select name="status" onChange={handleChange}>
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
