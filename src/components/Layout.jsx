import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="page-wrap">
      <div className="app-container">
        <Header />
        <Navigation />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
