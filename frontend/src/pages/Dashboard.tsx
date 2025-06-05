import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const Dashboard = () => {
  const userType = useUserStore((state) => state.userType);
  const navigate = useNavigate();

  useEffect(() => {
    if (userType === 'admin') {
      navigate('/admin-dashboard');
    } else if (userType === 'merchant') {
      navigate('/merchant-dashboard');
    } else if (userType === 'shopper') {
      navigate('/shopper-dashboard');
    }
  }, [userType, navigate]);

  return (
    <div className="text-center p-10">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default Dashboard;