import api from "./api";

// GET /inventory/health -> "Inventory Service is UP"
export const checkInventoryHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

// GET /inventory/vendors -> vendor list
export const getVendors = async () => {
  const response = await fetch("http://localhost:8080/vendors");
  if (!response.ok) {
    throw new Error("Failed to load vendors");
  }
  return await response.json();
};

// GET /inventory/categories -> material category list
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// POST /inventory/getUnitAndTypeList
export const getUnitAndTypeList = async (materialCategoryId) => {
  const response = await api.post("/getUnitAndTypeList", { materialCategoryId });
  return response.data;
};

// POST /inventory/addPurchaseDetail
export const addPurchase = async (purchaseData) => {
  const response = await api.post("/addPurchaseDetail", purchaseData);
  return response.data;
};