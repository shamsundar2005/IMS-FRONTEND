import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { checkVendorService, getVendorsFromVendorService } from "../services/vendorService";
import {
  getCategories,
  getUnitAndTypeList,
  addPurchase,
} from "../services/purchaseService";

const emptyForm = {
  vendorName: "",
  materialCategoryId: "",
  materialTypeId: "",
  unitId: "",
  brandName: "",
  quantity: "",
  purchaseAmount: "",
  purchaseDate: "",
};

export default function PurchaseEntry() {
  const navigate = useNavigate();

  const [health, setHealth] = useState("checking"); // checking | up | down

  const [vendors, setVendors] = useState([]);
  const [vendorsState, setVendorsState] = useState("loading"); // loading | ready | empty | error

  const [categories, setCategories] = useState([]);
  const [categoriesState, setCategoriesState] = useState("loading");

  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [typeUnitLoading, setTypeUnitLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadOptions = () => {
    setVendorsState("loading");
    setCategoriesState("loading");
    checkVendorService()
      .then(() => setHealth("up"))
      .catch(() => setHealth("down"));

    getVendorsFromVendorService()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setVendors(list);
        setVendorsState(list.length ? "ready" : "empty");
      })
      .catch(() => setVendorsState("error"));

    getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        setCategoriesState(list.length ? "ready" : "empty");
      })
      .catch(() => setCategoriesState("error"));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm((prev) => ({
      ...prev,
      materialCategoryId: categoryId,
      materialTypeId: "",
      unitId: "",
    }));
    setErrors((prev) => ({ ...prev, materialCategoryId: undefined }));
    setTypes([]);
    setUnits([]);

    if (!categoryId) return;

    setTypeUnitLoading(true);
    getUnitAndTypeList(categoryId)
      .then((data) => {
        setTypes(data?.materialTypeList || []);
        setUnits(data?.unitList || []);
      })
      .catch(() => {
        setTypes([]);
        setUnits([]);
      })
      .finally(() => setTypeUnitLoading(false));
  };

  const validate = () => {
    const next = {};

    // 1. Vendor Selection
    if (!form.vendorName?.trim()) {
      next.vendorName = "Vendor name is required.";
    }

    // 2. Material Category
    if (!form.materialCategoryId) {
      next.materialCategoryId = "Material category is required.";
    }

    // 3. Material Type
    if (!form.materialTypeId) {
      next.materialTypeId = "Material Type is required.";
    }

    // 4. Unit
    if (!form.unitId) {
      next.unitId = "Unit is required.";
    }

    // 5. Brand Name
    const trimmedBrand = form.brandName?.trim() || "";
    if (!trimmedBrand) {
      next.brandName = "Brand name is required.";
    } else if (trimmedBrand.length < 2) {
      next.brandName = "Brand name must be at least 2 characters.";
    } else if (trimmedBrand.length > 50) {
      next.brandName = "Brand name cannot exceed 50 characters.";
    }

    // 6. Quantity (Positive whole integer, max 1,000,000)
    const qtyVal = form.quantity?.toString().trim();
    const qtyNum = Number(qtyVal);
    if (!qtyVal) {
      next.quantity = "Quantity is required.";
    } else if (Number.isNaN(qtyNum)) {
      next.quantity = "Quantity must be a valid number.";
    } else if (!Number.isInteger(qtyNum)) {
      next.quantity = "Quantity must be a whole number (no decimals).";
    } else if (qtyNum <= 0) {
      next.quantity = "Quantity must be greater than zero.";
    } else if (qtyNum > 1000000) {
      next.quantity = "Quantity cannot exceed 1,000,000.";
    }

    // 7. Purchase Amount (Positive number, max 2 decimals)
    const amountVal = form.purchaseAmount?.toString().trim();
    const amountNum = Number(amountVal);
    if (!amountVal) {
      next.purchaseAmount = "Purchase amount is required.";
    } else if (Number.isNaN(amountNum)) {
      next.purchaseAmount = "Purchase amount must be a valid number.";
    } else if (amountNum <= 0) {
      next.purchaseAmount = "Purchase amount must be greater than ₹0.00.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(amountVal)) {
      next.purchaseAmount = "Purchase amount cannot have more than 2 decimal places.";
    }

    // 8. Purchase Date (Required, cannot be future date)
    if (!form.purchaseDate) {
      next.purchaseDate = "Purchase date is required.";
    } else {
      const selected = new Date(form.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selected > today) {
        next.purchaseDate = "Purchase date cannot be in the future.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        brandName: form.brandName.trim(),
        quantity: parseInt(form.quantity, 10),
        purchaseAmount: parseFloat(form.purchaseAmount),
      };
      const response = await addPurchase(payload);

      if (response?.status === "SUCCESS" && response?.purchase) {
        navigate("/purchase-success", { state: { purchase: response.purchase } });
      } else {
        setSubmitError(response?.message || "Unable to save purchase.");
      }
    } catch (err) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message;
      if (status === 400) {
        setSubmitError(backendMessage ? `Unable to save purchase. ${backendMessage}` : "Unable to save purchase.");
      } else if (status === 404 || status >= 500 || err?.request) {
        setSubmitError("Unable to connect to the Inventory Service.");
      } else {
        setSubmitError("Unable to save purchase.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const categorySelected = Boolean(form.materialCategoryId);
  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2 className="form-title">Material Purchase Entry</h2>

      {health !== "checking" && (
        <p style={{ textAlign: "center", fontSize: 12.5, color: health === "up" ? "#2c9146" : "#c0392b", marginBottom: 10 }}>
          Vendor Service: {health === "up" ? "Online" : "Offline"}
        </p>
      )}

      <form className="purchase-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="vendorName">Vendor name<span className="required-mark">*</span></label>
          {vendorsState === "loading" && <LoadingSpinner label="Loading vendors..." />}
          {vendorsState === "error" && <ErrorMessage message="Unable to load vendors." onRetry={loadOptions} />}
          {vendorsState === "empty" && <span style={{ fontSize: 13 }}>No vendors found.</span>}
          {vendorsState === "ready" && (
            <select id="vendorName" value={form.vendorName} onChange={handleField("vendorName")}>
              <option value="">--select--</option>
              {vendors.map((v) => (
                <option key={v.vendorId || v.vendorName} value={v.vendorName}>{v.vendorName}</option>
              ))}
            </select>
          )}
        </div>
        {errors.vendorName && <div className="field-error">{errors.vendorName}</div>}

        <div className="form-row">
          <label htmlFor="materialCategoryId">Material category<span className="required-mark">*</span></label>
          {categoriesState === "loading" && <LoadingSpinner label="Loading categories..." />}
          {categoriesState === "error" && <ErrorMessage message="Unable to load categories." onRetry={loadOptions} />}
          {categoriesState === "empty" && <span style={{ fontSize: 13 }}>No categories found.</span>}
          {categoriesState === "ready" && (
            <select id="materialCategoryId" value={form.materialCategoryId} onChange={handleCategoryChange}>
              <option value="">--select--</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          )}
        </div>
        {errors.materialCategoryId && <div className="field-error">{errors.materialCategoryId}</div>}

        
          <div className="form-row">
            <label htmlFor="materialTypeId">Material Type<span className="required-mark">*</span></label>
            <select
              id="materialTypeId"
              value={form.materialTypeId}
              onChange={handleField("materialTypeId")}
              disabled={!categorySelected || typeUnitLoading}
            >
              <option value="">{typeUnitLoading ? "Loading..." : "--Select--"}</option>
              {types.map((t) => (
                <option key={t.typeId} value={t.typeId}>
                  {t.typeName}
                </option>
              ))}
            </select>
          </div>
          {errors.materialTypeId && <div className="field-error">{errors.materialTypeId}</div>}

          <div className="form-row">
            <label htmlFor="unitId">Unit<span className="required-mark">*</span></label>
            <select
              id="unitId"
              value={form.unitId}
              onChange={handleField("unitId")}
              disabled={!categorySelected || typeUnitLoading}
            >
              <option value="">{typeUnitLoading ? "Loading..." : "--Select--"}</option>
              {units.map((u) => (
                <option key={u.unitId} value={u.unitId}>
                  {u.unitName}
                </option>
              ))}
            </select>
          </div>
          {errors.unitId && <div className="field-error">{errors.unitId}</div>}

          <div className="form-row">
            <label htmlFor="brandName">Brand name<span className="required-mark">*</span></label>
            <input
              id="brandName"
              type="text"
              maxLength={50}
              placeholder="e.g. Silk Elegance"
              value={form.brandName}
              onChange={handleField("brandName")}
            />
          </div>
          {errors.brandName && <div className="field-error">{errors.brandName}</div>}

          <div className="form-row">
            <label htmlFor="quantity">Quantity<span className="required-mark">*</span></label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="1000000"
              step="1"
              placeholder="e.g. 10"
              value={form.quantity}
              onChange={handleField("quantity")}
            />
          </div>
          {errors.quantity && <div className="field-error">{errors.quantity}</div>}

          <div className="form-row">
            <label htmlFor="purchaseAmount">Purchase Amount (₹)<span className="required-mark">*</span></label>
            <input
              id="purchaseAmount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 1500.00"
              value={form.purchaseAmount}
              onChange={handleField("purchaseAmount")}
            />
          </div>
          {errors.purchaseAmount && <div className="field-error">{errors.purchaseAmount}</div>}

          <div className="form-row">
            <label htmlFor="purchaseDate">Purchase Date<span className="required-mark">*</span></label>
            <input
              id="purchaseDate"
              type="date"
              max={maxDate}
              value={form.purchaseDate}
              onChange={handleField("purchaseDate")}
            />
          </div>
          {errors.purchaseDate && <div className="field-error">{errors.purchaseDate}</div>}

          {submitError && (
            <p style={{ fontSize: 13, color: "#c0392b", marginTop: 4 }}>{submitError}</p>
          )}

          <div className="submit-row">
            <button className="btn-green" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        
      </form>
    </div>
  );
}