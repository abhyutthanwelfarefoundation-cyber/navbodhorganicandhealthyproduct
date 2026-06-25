import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SisterConcerns from './pages/SisterConcerns';
import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MangoesPage   from './pages/Mangoes';
import Gallery       from './pages/Gallery';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import OrderSuccess  from './pages/OrderSuccess';
import { WhyUs, Contact, Order } from './pages/OtherPages';
import ScrollToTop   from './components/ScrollToTop';
import Pay from './pages/Pay';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminProducts  from './pages/admin/AdminProducts';

// Protects admin routes — redirects to login if not logged in
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAdmin();
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AdminProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>

              {/* ── Public store routes (with Navbar + Footer) ── */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/"              element={<Home />} />
                      <Route path="/products"      element={<Products />} />
                      <Route path="/products/:id"  element={<ProductDetail />} />
                      <Route path="/mangoes"       element={<MangoesPage />} />
                      <Route path="/gallery"       element={<Gallery />} />
                      <Route path="/cart"          element={<Cart />} />
                      <Route path="/checkout"      element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/why-us"        element={<WhyUs />} />
                      <Route path="/contact"       element={<Contact />} />
                      <Route path="/order"         element={<Order />} />
                      <Route path="/pay" element={<Pay />} />
                      <Route path="/sister-concerns" element={<SisterConcerns />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />

              {/* ── Admin routes (NO Navbar/Footer) ── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders"    element={<AdminOrders />} />
                <Route path="products"  element={<AdminProducts />} />
              </Route>

            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{ style: { fontFamily: "'Jost', sans-serif", borderRadius: 12, fontSize: 14 } }}
            />
          </CartProvider>
        </AdminProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;