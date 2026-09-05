import axios from "axios";

// VendorService is a separate backend, confirmed GET-only.
// Kept here for completeness — Purchase Entry uses /inventory/vendors
// instead (see purchaseService.js), per the spec.
const VENDOR_BASE_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:8082";

const vendorApi = axios.create({
  baseURL: VENDOR_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getVendorsFromVendorService = async () => {
  const response = await fetch("http://localhost:8080/vendors");
  if (!response.ok) {
    throw new Error("Failed to fetch vendors");
  }
  const data = await response.json();
  return data;
};

export const checkVendorService = async () => {
  const response = await vendorApi.get("/controller/");
  return response.data;
};


