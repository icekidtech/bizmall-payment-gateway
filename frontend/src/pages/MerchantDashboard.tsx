import DashboardCard from '../components/DashboardCard';

const MerchantDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Merchant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Your Balance" value="1,234 TON" />
        <DashboardCard title="Transactions Today" value="42" />
        <DashboardCard title="Total Sales" value="9,876 TON" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Merchant Overview</h2>
        <p>
          Welcome to your merchant dashboard. Here you can track your sales,
          manage payment links, and withdraw your earnings.
        </p>
      </div>
    </div>
  );
};

export default MerchantDashboard;