import { BrowserRouter as Router } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';
import './App.css'
import NavigationBar from './components/NavigationBar';

// Fix: Change HTTPS to HTTP for local development
const manifestUrl = 'http://localhost:5173/ton-connect-manifest.json';
// For production, use your actual domain with HTTPS
// const manifestUrl = 'https://your-domain.com/ton-connect-manifest.json';

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <NavigationBar />
          <main className="container mx-auto p-4">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </TonConnectUIProvider>
  )
}

export default App
