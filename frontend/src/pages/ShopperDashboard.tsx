import DashboardCard from '../components/DashboardCard';

const ShopperDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopper Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Your Balance" value="123 TON" />
        <DashboardCard title="Recent Purchases" value="7" />
        <DashboardCard title="Available Vouchers" value="3" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Shopper Overview</h2>
        <p>
          Welcome to your shopper dashboard. Here you can view your purchase history,
          manage your wallet, and find new merchants to shop with.
        </p>
      </div>
    </div>
  );
};

export default ShopperDashboard;