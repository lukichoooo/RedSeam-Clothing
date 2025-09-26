import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import ProductsPage from './pages/products/productsPage/ProductsPage';
import About from './pages/about/About';
import LoginPage from './pages/auth/LoginPage';
import { ThemeProvider } from './services/context/ThemeContext';
import RegistrationPage from './pages/auth/RegistrationPage';

export default function App()
{
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </ThemeProvider>
  );
}
