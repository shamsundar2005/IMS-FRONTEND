import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 860, margin: "20px auto", padding: "0 20px" }}>
      {/* Hero Welcome Banner */}
      <div
        style={{
          borderBottom: "2px solid #eaeaea",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: "600", color: "#2c3e50", margin: "0 0 8px 0" }}>
          Glory Textiles Inventory Management
        </h2>
        <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Centralized supply chain hub for Glory Textiles to track raw material procurement,
          manage verified vendor catalogues, and analyze purchase records across production cycles.
        </p>
      </div>

      {/* Quick Access Action Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 20,
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 17, color: "#16a085" }}>
              Material Purchase Entry
            </h3>
            <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.5, margin: "0 0 16px 0" }}>
              Record inward consignments for fabric, yarn, thread, and accessories with
              real-time validation on quantities and costs.
            </p>
          </div>
          <button
            className="btn-green"
            style={{ width: "fit-content", padding: "8px 18px", fontSize: 13 }}
            onClick={() => navigate("/purchase-entry")}
          >
            Create Entry &rarr;
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 20,
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 17, color: "#2980b9" }}>
              Vendor Purchase Reports
            </h3>
            <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.5, margin: "0 0 16px 0" }}>
              Query vendor-wise procurement histories across custom date ranges and examine
              reconciliation balances and contact records.
            </p>
          </div>
          <button
            className="btn-green"
            style={{ width: "fit-content", padding: "8px 18px", fontSize: 13, backgroundColor: "#2980b9" }}
            onClick={() => navigate("/reports")}
          >
            View Reports &rarr;
          </button>
        </div>
      </div>

      {/* Capstone Architecture Snapshot */}
      <div
        style={{
          backgroundColor: "#f9fbfd",
          border: "1px solid #e1e8ed",
          borderRadius: 6,
          padding: "18px 24px",
          fontSize: 13,
          color: "#444",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#2c3e50" }}>
          Microservices Distribution
        </h4>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>
            <strong>Vendor Service (Port 8082):</strong> Serves supplier registry, address profiles, and contact details.
          </li>
          <li>
            <strong>Material Service (Port 8081):</strong> Manages taxonomy for categories, material types, and measurement units.
          </li>
          <li>
            <strong>Inventory Service (Port 8080):</strong> Processes transactions, applies business validations, and aggregates reporting data.
          </li>
        </ul>
      </div>
    </div>
  );
}