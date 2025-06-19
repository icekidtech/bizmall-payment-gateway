import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PaymentDemo from "../pages/PaymentDemo";
import Dashboard from "../pages/Dashboard";
import MerchantDashboard from "../pages/MerchantDashboard";
import ShopperDashboard from "../pages/ShopperDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Transactions from "../pages/Transactions";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/payment-demo" element={<PaymentDemo />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/merchant" element={<MerchantDashboard />} />
      <Route path="/shopper" element={<ShopperDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/transactions" element={<Transactions />} />
    </Routes>
  );
}

export default AppRoutes;