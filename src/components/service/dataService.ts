
import React, { useState } from 'react';
import { Eye, EyeOff, ShoppingCart, Minus, CheckCircle } from 'lucide-react';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  discountPercentage: number;
}

interface CartItem extends Product {
  quantity: number;
}

// API Service
const api = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },
  
  fetchProducts: async (): Promise<Product[]> => {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products;
  }
};