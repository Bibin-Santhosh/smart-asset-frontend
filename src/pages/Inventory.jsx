import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Inventory.css";

const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("item_type");
  const [order, setOrder] = useState("asc");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    api.get("inventory/")
      .then(res => setItems(res.data))
      .catch(() => alert("Failed to load inventory"));
  };

  const filtered = items
    .filter(i =>
      i.item_type.toLowerCase().includes(search.toLowerCase())
    )
    .filter(i =>
      lowStockOnly ? i.quantity <= i.threshold : true
    )
    .sort((a, b) => {
      let x = a[sortBy];
      let y = b[sortBy];
      if (typeof x === "string") x = x.toLowerCase();
      if (typeof y === "string") y = y.toLowerCase();
      return order === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });

  const deleteItem = (id) => {
    if (!window.confirm("Delete this item?")) return;
    api.delete(`inventory/${id}/`).then(fetchInventory);
  };

  return (
    <div>
      <h2>Inventory</h2>

      {/* 🔍 TOOLBAR */}
      <div className="inventory-toolbar">
        <input
          placeholder="Search inventory..."
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setSortBy(e.target.value)}>
          <option value="item_type">Name</option>
          <option value="quantity">Quantity</option>
          <option value="threshold">Threshold</option>
        </select>

        <button
          className="btn-outline"
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        >
          {order === "asc" ? "ASC ↑" : "DESC ↓"}
        </button>

        <button
          className="btn-primary"
          onClick={() => navigate("/inventory/add")}
        >
          ADD ITEM
        </button>

        <button
          className="btn-danger"
          onClick={() => setLowStockOnly(!lowStockOnly)}
        >
          SHOW LOW STOCK ONLY
        </button>
      </div>

      {/* 📋 TABLE */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(item => (
            <tr key={item.id}>
              <td>{item.item_type}</td>
              <td>{item.quantity}</td>
              <td>{item.threshold}</td>
              <td className={item.status === "LOW_STOCK" ? "low" : "ok"}>
  {item.status === "LOW_STOCK" ? "Low Stock" : "Ok"}
</td>

              <td>
                <span
                  className="link"
                  onClick={() => navigate(`/inventory/edit/${item.id}`)}
                >
                  EDIT
                </span>
                <span
                  className="link danger"
                  onClick={() => deleteItem(item.id)}
                >
                  DELETE
                </span>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">
                No inventory found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
