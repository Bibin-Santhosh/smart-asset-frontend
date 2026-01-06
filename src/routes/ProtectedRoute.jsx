import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
