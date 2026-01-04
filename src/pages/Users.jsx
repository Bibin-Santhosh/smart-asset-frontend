import { useEffect, useState } from "react";
import api from "../api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Users API error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Users</h2>

      <table
        style={{
          width: "100%",
          background: "#fff",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "12px" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={getRoleStyle(user.role)}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px",
};

function getRoleStyle(role) {
  let background = "#64748b";

  if (role === "ADMIN") background = "#dc2626";
  if (role === "EMPLOYEE") background = "#2563eb";
  if (role === "TECHNICIAN") background = "#ea580c";

  return {
    padding: "4px 10px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    background,
  };
}

export default Users;
