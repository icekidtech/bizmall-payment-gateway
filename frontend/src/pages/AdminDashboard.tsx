import DashboardCard from '../components/DashboardCard';

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Transactions" value="1,234" />
        <DashboardCard title="Active Merchants" value="56" />
        <DashboardCard title="Total Revenue" value="98,765 TON" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <p>
          Welcome to the admin dashboard. Here you can monitor system performance,
          manage merchants, and view transaction statistics.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;