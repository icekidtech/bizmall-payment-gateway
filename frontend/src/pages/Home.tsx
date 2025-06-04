import TonCheckout from '../components/TonCheckout';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        BizMall TON Payment Gateway Mock
      </h1>
      <div className="max-w-md mx-auto">
        <TonCheckout />
      </div>
    </div>
  );
};

export default Home;