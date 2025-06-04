import { Navigate, Route, Routes } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import AdminDashboard from '../pages/AdminDashboard';
import MerchantDashboard from '../pages/MerchantDashboard';
import ShopperDashboard from '../pages/ShopperDashboard';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useUserStore((state) => state.token);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/merchant-dashboard" 
        element={
          <ProtectedRoute>
            <MerchantDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/shopper-dashboard" 
        element={
          <ProtectedRoute>
            <ShopperDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;