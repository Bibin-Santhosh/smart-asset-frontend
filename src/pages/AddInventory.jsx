import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./InventoryForm.css";

const AddInventory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    item_type: "",
    quantity: "",
    threshold: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("inventory/", form)
      .then(() => {
        alert("Item added successfully");
        navigate("/inventory");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data, null, 2));
      });
  };

  return (
    <div className="inventory-form-container">
      <h2 className="inventory-form-title">Add Inventory Item</h2>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <input
          name="item_type"
          placeholder="Item Name"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="threshold"
          placeholder="Low Stock Threshold"
          onChange={handleChange}
          required
        />

        <button className="inventory-form-btn">
          Save Item
        </button>
      </form>
    </div>
  );
};

export default AddInventory;
