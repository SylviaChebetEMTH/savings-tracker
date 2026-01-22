import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../service/interface';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.thumbnail} 
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-green-600">
              KES {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {product.discountPercentage}% subsidy
            </p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;