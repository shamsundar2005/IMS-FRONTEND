import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isEntry = location.pathname.startsWith("/purchase-entry") || location.pathname.startsWith("/purchase-success");
  const isReport = location.pathname.startsWith("/reports");

  return (
    <nav className="nav-bar">
      <Link to="/" className={`nav-item${isHome ? " active" : ""}`}>Home</Link>
      <Link to="/purchase-entry" className={`nav-item${isEntry ? " active" : ""}`}>Entry</Link>
      <Link to="/reports" className={`nav-item${isReport ? " active" : ""}`}>Report</Link>
    </nav>
  );
}
