import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "login/",
        {
          username,
          password,
        }
      );

      const token = response.data.access;

      // Save JWT token
      localStorage.setItem("token", token);

      // Decode token to get role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      console.log("Logged in role:", role); // DEBUG (remove later)

      // Role-based redirect
      if (role === "Admin") {
        navigate("/dashboard");
      } else if (role === "Technician") {
        navigate("/technician-dashboard");
      } else if (role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        alert("Role not assigned. Contact admin.");
      }

    } catch (error) {
      alert("Invalid username or password");
      console.error(error.response?.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
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
