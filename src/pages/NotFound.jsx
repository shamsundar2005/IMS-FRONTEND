import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 10 }}>Page not found</h2>
      <p style={{ fontSize: 13.5, marginBottom: 14 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link className="btn-link" to="/">Return to Home</Link>
    </div>
  );
}
