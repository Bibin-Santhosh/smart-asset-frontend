import { useEffect, useState } from "react";
import api from "../api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");

  // Load profile
  useEffect(() => {
    api
      .get("/profile/")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile error:", err);
        setMessage("Failed to load profile");
      });
  }, []);

  // Change password
  const handleChangePassword = () => {
    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      setMessage("All fields are required");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setMessage("New passwords do not match");
      return;
    }

    api
      .post("/change-password/", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      })
      .then(() => {
        alert("Password changed successfully. Please login again.");
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((err) => {
        setMessage(err.response?.data?.error || "Password change failed");
      });
  };

  return (
    <div className="profile-page">
      <h2 className="page-title">My Profile</h2>

      <div className="profile-grid">
        {/* Profile Info */}
        <div className="profile-card">
          <h3>Profile Information</h3>

          <div className="form-group">
            <label>Username</label>
            <input value={user.username || ""} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={user.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input value={user.role || ""} disabled />
          </div>
        </div>

        {/* Security */}
        <div className="profile-card">
          <h3>Security</h3>

          <div className="form-group">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.current_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  current_password: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={passwords.new_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  new_password: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirm_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirm_password: e.target.value,
                })
              }
            />
          </div>

          <button className="danger-btn" onClick={handleChangePassword}>
            CHANGE PASSWORD
          </button>

          {message && (
            <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
