import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to BizMall TON Payment Gateway</h1>
      <p className="text-xl mb-8">
        A secure and efficient way to process TON cryptocurrency payments for your business.
      </p>
      <Link 
        to="/dashboard" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;