import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Transaction</h2>
        <TransactionForm />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2 px-4">12345</td>
                <td className="py-2 px-4">2025-06-01</td>
                <td className="py-2 px-4">100 TON</td>
                <td className="py-2 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Completed</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4">12344</td>
                <td className="py-2 px-4">2025-05-30</td>
                <td className="py-2 px-4">75 TON</td>
                <td className="py-2 px-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;