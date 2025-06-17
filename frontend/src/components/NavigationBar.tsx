import { Link, useNavigate } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';
import { useUserStore } from '../store/userStore';

const NavigationBar = () => {
  const { token, clearUser } = useUserStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">BizMall</div>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/transactions" className="hover:text-gray-300">Transactions</Link>
              <button 
                onClick={handleLogout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hover:text-gray-300">Signup</Link>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
            </>
          )}
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;