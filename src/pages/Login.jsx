import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("login/", {
        username,
        password,
      });

      // Tokens from backend
      const access = response.data.access;
      const refresh = response.data.refresh;

      // ✅ STORE USING CORRECT KEYS
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Decode JWT to get role
      const decoded = jwtDecode(access);
      const role = decoded.role;

      console.log("Logged in role:", role);

      // Role-based redirect
      if (role === "ADMIN") {
  window.location.href = "/dashboard";
} else if (role === "TECHNICIAN") {
  window.location.href = "/technician-dashboard";
} else if (role === "EMPLOYEE") {
  window.location.href = "/employee-dashboard";
} else {
  alert("Role not assigned. Contact admin.");
}


    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
