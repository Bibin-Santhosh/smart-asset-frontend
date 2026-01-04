import "./Header.css";
import logo from "../assets/logo.png";
import { 
   useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Asset Manager Logo" className="logo" />
        <h1>Smart Asset & Inventory Management System</h1>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </header>
  );
}

export default Header;
