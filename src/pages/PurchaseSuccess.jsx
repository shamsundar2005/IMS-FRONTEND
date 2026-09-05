import { Link, Navigate, useLocation } from "react-router-dom";

export default function PurchaseSuccess() {
  const location = useLocation();
  const purchase = location.state?.purchase;

  // No direct navigation here without real data — never display fake
  // purchase details.
  if (!purchase) {
    return <Navigate to="/purchase-entry" replace />;
  }

  const formattedDate = purchase.purchaseDate
    ? new Date(purchase.purchaseDate).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      }).replace(/ /g, "-")
    : "";

  return (
    <div>
      <h2 className="form-title">Material Purchase Details</h2>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <dl style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 10, fontSize: 13.5 }}>
          <dt style={{ fontWeight: "bold" }}>Vendor name</dt>
          <dd style={{ margin: 0 }}>{purchase.vendorName}</dd>

          <dt style={{ fontWeight: "bold" }}>Material category</dt>
          <dd style={{ margin: 0 }}>{purchase.materialCategoryName || purchase.materialCategoryId}</dd>

          <dt style={{ fontWeight: "bold" }}>Material Type</dt>
          <dd style={{ margin: 0 }}>{purchase.materialTypeName || purchase.materialTypeId}</dd>

          <dt style={{ fontWeight: "bold" }}>Unit</dt>
          <dd style={{ margin: 0 }}>{purchase.materialUnitName || purchase.unitId}</dd>

          <dt style={{ fontWeight: "bold" }}>Brand name</dt>
          <dd style={{ margin: 0 }}>{purchase.brandName}</dd>

          <dt style={{ fontWeight: "bold" }}>Quantity</dt>
          <dd style={{ margin: 0 }}>{purchase.quantity}</dd>

          <dt style={{ fontWeight: "bold" }}>Purchase Amount(₹)</dt>
          <dd style={{ margin: 0 }}>{Number(purchase.purchaseAmount).toFixed(2)}</dd>

          <dt style={{ fontWeight: "bold" }}>Purchase Date</dt>
          <dd style={{ margin: 0 }}>{formattedDate}</dd>
        </dl>

        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 10, fontSize: 13.5 }}>
          <dt style={{ fontWeight: "bold" }}>Purchase Id</dt>
          <dd style={{ margin: 0 }}>{purchase.purchaseId}</dd>
          {purchase.transactionId && (
            <>
              <dt style={{ fontWeight: "bold" }}>Transaction ID</dt>
              <dd style={{ margin: 0 }}>{purchase.transactionId}</dd>
            </>
          )}
        </div>

        <p style={{ color: "#2c9146", fontSize: 14, marginTop: 20 }}>
          {purchase.status === "SUCCESS" ? "Data added successfully!" : ""}
        </p>

        <div style={{ marginTop: 10 }}>
          <Link className="btn-link" to="/purchase-entry">Add Another Purchase</Link>
          <Link className="btn-link" to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
