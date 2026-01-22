import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User, CartItem } from './service/interface';
import { CartProvider, useCart } from './components/context/CartContext';
import LoginPage from './components/forms/LoginForm';
import ProductsPage from './components/pages/ProductPage';
import SummaryPage from './components/pages/SummaryPage';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const { cart, clearCart } = useCart();

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
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
            user ? (
              <SummaryPageWrapper
                cart={cart}
                onClearCart={clearCart}
                onDone={() => {}}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={user ? "/products" : "/login"} />} />
      </Routes>
    </div>
  );
}

function SummaryPageWrapper({ 
  cart,
  onClearCart,
  onDone,
  onLogout
}: { 
  cart: CartItem[];
  onClearCart: () => void;
  onDone: () => void;
  onLogout: () => void;
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [paymentCart] = useState<CartItem[]>(cart.length > 0 ? [...cart] : []);

  // Calculate totals
  const calculateTotalDeduction = () => {
    return paymentCart.reduce((sum, item) =>
      sum + ((item.price * item.quantity * item.discountPercentage) / 100), 0
    );
  };

  const totalDeduction = calculateTotalDeduction();

  const handleBack = () => {
    setShowSuccess(false);
    navigate(-1);
  };

  const handleConfirmPayment = (code: string) => {
    console.log("Confirming with code:", code);
    onClearCart();
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onDone();
    navigate('/products');
  };

  // If no cart items initially, redirect to products
  useEffect(() => {
    if (cart.length === 0 && paymentCart.length === 0) {
      navigate('/products', { replace: true });
    }
  }, [cart.length, paymentCart.length, navigate]);

  if (cart.length === 0 && paymentCart.length === 0) {
    return null;
  }

  return (
    <SummaryPage
      cart={paymentCart}
      totalDeduction={totalDeduction}
      onBack={handleBack}
      onConfirmPayment={handleConfirmPayment}
      showSuccess={showSuccess}
      onDone={handleDone}
      onLogout={onLogout}
    />
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

