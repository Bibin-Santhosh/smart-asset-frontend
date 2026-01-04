import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./InventoryForm.css";

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    item_type: "",
    quantity: "",
    threshold: "",
  });

  const [loading, setLoading] = useState(true);

  /* ===== LOAD INVENTORY ITEM ===== */
  useEffect(() => {
    api
      .get(`inventory/${id}/`)
      .then((res) => {
        setForm({
          item_type: res.data.item_type,
          quantity: res.data.quantity,
          threshold: res.data.threshold,
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load inventory item");
        navigate("/inventory");
      });
  }, [id, navigate]);

  /* ===== HANDLE FORM CHANGE ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== UPDATE ITEM ===== */
  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .put(`inventory/${id}/`, form)
      .then(() => {
        alert("Inventory updated successfully");
        navigate("/inventory");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data, null, 2));
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="inventory-form-container">
      <h2 className="inventory-form-title">Edit Inventory Item</h2>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <input
          name="item_type"
          placeholder="Item Name"
          value={form.item_type}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="threshold"
          placeholder="Low Stock Threshold"
          value={form.threshold}
          onChange={handleChange}
          required
        />

        <button className="inventory-form-btn">
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditInventory;
