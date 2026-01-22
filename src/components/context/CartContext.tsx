import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../service/interface';

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  updateQuantity: (productId: number, value: string) => void;
  calculateTotalDeduction: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = (productId: number) => {
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity > 1) {
      setCart(cart.map(i =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setCart(cart.filter(i => i.id !== productId));
    }
  };

  const updateQuantity = (productId: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num === 0) {
      setCart(cart.filter(i => i.id !== productId));
    } else if (num > 0 && num <= 99) {
      setCart(cart.map(i =>
        i.id === productId ? { ...i, quantity: num } : i
      ));
    }
  };

  const calculateTotalDeduction = () => {
    return cart.reduce((sum, item) =>
      sum + ((item.price * item.quantity * item.discountPercentage) / 100), 0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        calculateTotalDeduction,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

