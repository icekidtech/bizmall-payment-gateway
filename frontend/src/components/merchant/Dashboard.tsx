import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatTonAmount, formatDate } from '../utils/formatters';
import DashboardCard from '../components/common/DashboardCard';
import TransactionList from '../components/merchant/TransactionList';
import IntegrationGuide from '../components/merchant/IntegrationGuide';

const MerchantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings' | 'integration'>('overview');
  const [dashboardData, setDashboardData] = useState<any>({
    balance: '0',
    transactionCount: 0,
    pendingPayments: 0,
    totalRevenue: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.merchant.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'integration', label: 'Integration', icon: '🔧' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Merchant Dashboard
              </h1>
              <p className="text-gray-600">Manage your TON payments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatTonAmount(dashboardData.balance)} TON
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardCard 
                    title="Current Balance" 
                    value={`${formatTonAmount(dashboardData.balance)} TON`} 
                    icon="wallet"
                  />
                  <DashboardCard 
                    title="Total Revenue" 
                    value={`${formatTonAmount(dashboardData.totalRevenue)} TON`}
                    icon="chart-bar" 
                  />
                  <DashboardCard 
                    title="Transactions" 
                    value={dashboardData.transactionCount.toString()}
                    icon="document-text" 
                  />
                  <DashboardCard 
                    title="Pending Payments" 
                    value={dashboardData.pendingPayments.toString()}
                    icon="clock" 
                  />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Transactions
                    </h3>
                  </div>
                  <TransactionList limit={5} />
                </div>
              </div>
            )}

            {activeTab === 'transactions' && <TransactionList />}
            {activeTab === 'settings' && <p>Settings content here</p>}
            {activeTab === 'integration' && <IntegrationGuide />}
          </>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;