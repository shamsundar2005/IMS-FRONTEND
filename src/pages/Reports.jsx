import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getVendorsFromVendorService } from "../services/vendorService";
import { getVendorPurchaseReport } from "../services/reportService";

export default function Reports() {
  const [vendors, setVendors] = useState([]);
  const [vendorsState, setVendorsState] = useState("loading");

  const [vendorName, setVendorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [reportData, setReportData] = useState([]);
  const [reportState, setReportState] = useState("idle"); // idle | loading | ready | empty | error
  const [reportError, setReportError] = useState("");

  const selectedVendorDetails = vendors.find((v) => v.vendorName === vendorName);

  const loadVendors = () => {
    setVendorsState("loading");
    getVendorsFromVendorService()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setVendors(list);
        setVendorsState(list.length ? "ready" : "empty");
      })
      .catch(() => setVendorsState("error"));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const formatDate = (rawDate) => {
    if (!rawDate) return "-";
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return rawDate;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // Output example: 10-Aug-2026
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReportError("");
    setReportState("loading");

    try {
      const data = await getVendorPurchaseReport({ fromDate, toDate, vendorName });
      const list = Array.isArray(data) ? data : [];
      setReportData(list);
      setReportState(list.length ? "ready" : "empty");
    } catch (err) {
      setReportState("error");
      const backendMessage = err?.response?.data?.message;
      setReportError(backendMessage || "Unable to fetch report data.");
    }
  };

  return (
    <div>
      <h2 className="form-title">Vendor - Purchased Item Report</h2>

      <form className="report-filter-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="vendorName">Vendor Name</label>
          {vendorsState === "loading" && <LoadingSpinner label="Loading vendors..." />}
          {vendorsState === "error" && <ErrorMessage message="Unable to load vendors." onRetry={loadVendors} />}
          {vendorsState === "empty" && <span style={{ fontSize: 13 }}>No vendors found.</span>}
          {vendorsState === "ready" && (
            <select
              id="vendorName"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            >
              <option value="">--select--</option>
              {vendors.map((v) => (
                <option key={v.vendorId || v.vendorName} value={v.vendorName}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="fromDate">From Date</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="toDate">To Date</label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        <button className="btn-green" type="submit">Submit</button>
      </form>

      {/* Vendor Details Banner */}
      {selectedVendorDetails && reportState === "ready" && (
        <div style={{ margin: "16px auto", textAlign: "center", fontSize: 13.5, fontWeight: "bold" }}>
          <span>Vendor Address: </span>
          <span style={{ fontWeight: "normal" }}>{selectedVendorDetails.vendorAddress} </span>
          <span>Contact Person: </span>
          <span style={{ fontWeight: "normal" }}>{selectedVendorDetails.contactPerson} </span>
          <span>Contact Number: </span>
          <span style={{ fontWeight: "normal" }}>{selectedVendorDetails.contactNumber}</span>
        </div>
      )}

      {reportState === "loading" && <LoadingSpinner label="Loading report..." />}
      {reportState === "error" && <ErrorMessage message={reportError} />}
      {reportState === "empty" && (
        <p style={{ fontSize: 13, color: "#555", textAlign: "center", maxWidth: 560, margin: "20px auto" }}>
          No purchase details found for the selected criteria.
        </p>
      )}

      {reportState === "ready" && (
        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Material Category</th>
                <th>Material Type</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Price (₹)</th>
                <th>Balance (₹)</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={row.purchaseId || idx}>
                  <td>{idx + 1}</td>
                  <td>{row.materialCategory || row.materialCategoryName || row.materialCategoryId}</td>
                  <td>{row.materialType || row.materialTypeName || row.materialTypeId}</td>
                  <td>{row.brand || row.brandName}</td>
                  <td>{row.quantity}</td>
                  <td>{row.unit || row.materialUnitName || row.unitId}</td>
                  <td>{row.price || row.purchaseAmount}</td>
                  <td>{row.balance ?? (row.price || row.purchaseAmount)}</td>
                  <td>{formatDate(row.purchaseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}