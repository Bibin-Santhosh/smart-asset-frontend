import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditAsset.css";

const EditAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    serial_number: "",
    status: "",
    purchase_date: "",
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/assets/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setForm(res.data))
      .catch(() => alert("Failed to load asset"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://127.0.0.1:8000/api/assets/${id}/`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Asset updated successfully");
        navigate("/assets");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data, null, 2));
      });
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

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="LAPTOP">Laptop</option>
          <option value="KEYBOARD">Keyboard</option>
          <option value="MOUSE">Mouse</option>
          <option value="MONITOR">Monitor</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="AVAILABLE">Available</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="ASSIGNED">Assigned</option>
        </select>

        <div className="edit-asset-actions">
          <button className="edit-asset-btn">
            Update Asset
          </button>

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
