import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PurchaseEntry from "./pages/PurchaseEntry";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/purchase-entry" element={<PurchaseEntry />} />
          <Route path="/purchase-success" element={<PurchaseSuccess />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
