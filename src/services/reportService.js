import api from "./api";

// POST /report/controller/getPurchaseDetails
// Body: { fromDate, toDate, vendorName }
// Response: PurchaseBean[]
export const getVendorPurchaseReport = async ({ fromDate, toDate, vendorName }) => {
  const response = await api.post("/report/controller/getPurchaseDetails", {
    fromDate,
    toDate,
    vendorName,
  });
  return response.data;
};
