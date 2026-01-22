import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from './service/interface';
import { CartProvider, useCart } from './components/context/CartContext';
import LoginPage from './components/forms/LoginForm';
import ProductsPage from './components/pages/ProductPage';
import SummaryPage from './components/pages/SummaryPage';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { cart, clearCart } = useCart();

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/products" />}
          />
          <Route
            path="/products"
            element={
              user ? (
                <ProductsPage
                  user={user}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/summary"
            element={
              user && cart.length > 0 ? (
                <SummaryPage
                  onBack={() => window.history.back()}
                  onConfirmPayment={(code) => {
                    console.log("Confirming with code:", code);
                    clearCart();
                    setShowSuccess(true);
                  }}
                  showSuccess={showSuccess}
                />
              ) : (
                <Navigate to="/products" />
              )
            }
          />
          <Route path="*" element={<Navigate to={user ? "/products" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;

