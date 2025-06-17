import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';
import './App.css'
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavigationBar />
        <main className="container mx-auto p-4">
          <AppRoutes />
        </main>
      </div>
    </Router>
  )
}

export default App
