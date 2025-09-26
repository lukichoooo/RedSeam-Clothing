import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import ProductsPage from './pages/products/productsPage/ProductsPage';
import About from './pages/about/About';
import LoginPage from './pages/auth/LoginPage';
import { ThemeProvider } from './services/context/ThemeContext';
import RegistrationPage from './pages/auth/RegistrationPage';
import ProductPage from './pages/products/productPage/ProductPage';
import CheckoutPage from './pages/products/checkout/CheckoutPage';

export default function App()
{
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        {/* Product Routes */}
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Static Routes */}
        <Route path="/about" element={<About />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </ThemeProvider>
  );
}
