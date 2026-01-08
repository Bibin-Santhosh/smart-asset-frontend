import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("users/create/", form);
      alert("User created successfully");
      navigate("/users");
    } catch (err) {
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add User</h2>

      <form onSubmit={handleSubmit} className="add-user-form">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />

        <select name="role" onChange={handleChange}>
          <option value="ADMIN">Admin</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="TECHNICIAN">Technician</option>
        </select>

        <button>Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
