import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import { ThemeProvider } from './services/context/ThemeContext';
import './App.css';

export default function App()
{
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </ThemeProvider>
  );
}
