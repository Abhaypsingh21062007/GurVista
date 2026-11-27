import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import JaggeryMarketplace from './pages/JaggeryMarketplace';
import BagasseMarketplace from './pages/BagasseMarketplace';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Producers from './pages/Producers';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages — no site layout (own full-screen design) */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* Dashboard pages — no site layout */}
            <Route path="/dashboard/buyer"  element={<BuyerDashboard />}  />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />

            {/* Main site with navbar + footer */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="jaggery"       element={<JaggeryMarketplace />} />
              <Route path="bagasse"       element={<BagasseMarketplace />} />
              <Route path="products"      element={<Products />} />
              <Route path="products/:id"  element={<ProductDetail />} />
              <Route path="producers"     element={<Producers />} />
              <Route path="about"         element={<About />} />
              <Route path="contact"       element={<Contact />} />
              <Route path="orders"        element={<Orders />} />
              <Route path="sell"          element={<Navigate to="/register?role=seller" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
