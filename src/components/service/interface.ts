export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  discountPercentage: number;
}

export interface CartItem extends Product {
  quantity: number;
}