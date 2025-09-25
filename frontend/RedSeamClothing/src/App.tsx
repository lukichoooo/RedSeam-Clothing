import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Dashboard from './pages/dashboard/Dashboard';
import LoginPage from './pages/auth/LoginPage';
import { ThemeProvider } from './services/context/ThemeContext';
import RegistrationPage from './pages/auth/RegistrationPage';

export default function App()
{
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </ThemeProvider>
  );
}
