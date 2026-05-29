import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MangoesPage   from './pages/Mangoes';
import Gallery from './pages/Gallery';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import { OrderSuccess, WhyUs, Contact, Order } from './pages/OtherPages';
import ScrollToTop from './components/ScrollToTop';
                  
function App() {         
  return (
    <BrowserRouter>
      <CartProvider>               
         <ScrollToTop />  
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
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{ style: { fontFamily: "'Jost', sans-serif", borderRadius: 12, fontSize: 14 } }}
        />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
