import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AddAssignment.css";

function AddAssignment() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    asset: "",
    employee: "",
  });

  useEffect(() => {
    // Load AVAILABLE assets only
    api.get("assets/").then((res) => {
      setAssets(res.data.filter(a => a.status === "AVAILABLE"));
    })
    .catch(err => {
    console.error("FAILED URL:", err.config?.url);
    console.error("STATUS:", err.response?.status);
    alert("404 from: " + err.config?.url);
  
    });

    api.get("users/")
  .then((res) => setUsers(res.data))
  .catch(err => {
    console.error("FAILED URL:", err.config?.url);
    console.error("STATUS:", err.response?.status);
    alert("404 from: " + err.config?.url);
  });

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("assignments/", form)
      .then(() => {
        alert("Asset assigned successfully");
        navigate("/assignments");
      })
      .catch((err) => {
        alert(err.response?.data || "Failed to assign asset");
      });
  };

  return (
    <div className="add-assignment-container">
      <h2 className="add-assignment-title">Assign Asset</h2>

      <form className="add-assignment-form" onSubmit={handleSubmit}>
        <select name="asset" onChange={handleChange} required>
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select name="employee" onChange={handleChange} required>
          <option value="">Select Employee</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <button className="add-assignment-btn">Assign Asset</button>
      </form>
    </div>
  );
}

export default AddAssignment;
