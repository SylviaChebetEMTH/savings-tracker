import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { User, Product } from '../../service/interface';
import { api } from '../../service/dataService';
import ConfirmationModal from './ConfirmModal';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductsPageProps {
    user: User;
    onLogout: () => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ user, onLogout }) => {
    const { cart, addToCart, decreaseQuantity, updateQuantity, calculateTotalDeduction, setCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const walletBalance = 2400.00;

    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const paginatedProducts = products.slice(startIndex, endIndex);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await api.fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        const totalDeduction = calculateTotalDeduction();

        if (totalDeduction <= walletBalance) {
            setShowConfirmation(true);
            setCart([]);
        }
    };
    const handleProceedToSummary = () => {
        if (cart.length === 0) return;

        const deduction = calculateTotalDeduction();
        if (deduction <= 0) {
            alert("No subsidy applicable for selected items");
            return;
        }

        navigate('/summary');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-yellow-700 to-yellow-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Inua Mkulima Subsidy Program</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Logged in as:</span>
                        <span className="font-semibold">{user.firstName}</span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-white text-black bg-opacity-20 hover:bg-opacity-30 rounded flex items-center gap-2 text-sm"
                        >
                            <span>↗</span> Logout
                        </button>
                    </div>
                </div>
            </header>


            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-6">

                    <aside className="w-64 bg-white rounded-lg shadow-sm h-fit">
                        <nav className="py-2">
                            <div className="px-4 py-3 bg-yellow-100 border-l-4 border-yellow-600 font-medium text-gray-800">
                                Dashboard
                            </div>
                            <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer">
                                Transactions
                            </div>
                            <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer">
                                Reports
                            </div>
                        </nav>
                    </aside>


                    <main className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">

                            <div className="flex items-center gap-4 mb-6">
                                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                                    <ChevronLeft size={18} />
                                    Back
                                </button>
                                <h2 className="text-xl font-semibold text-gray-700">Product Details</h2>
                            </div>


                            <div className="mb-6">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Inua mkulima wallet</span> balance:
                                    <span className="font-bold ml-2">Kes {walletBalance.toFixed(2)}</span>
                                </p>
                            </div>


                            <div className="grid grid-cols-2 gap-6">

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">Products</h3>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-300">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Product name</th>
                                                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Price</th>
                                                    <th className="w-12"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedProducts.map((product) => {
                                                    const inCart = cart.find(item => item.id === product.id);
                                                    return (
                                                        <tr key={product.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-600">{product.title}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                                                {product.price.toFixed(0)} kes
                                                            </td>
                                                            <td className="px-2 py-3 text-center">
                                                                <button
                                                                    onClick={() => addToCart(product)}
                                                                    className="w-7 h-7 rounded-full border-2 border-gray-400 hover:border-gray-600 hover:bg-gray-50 flex items-center justify-center text-gray-600 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    disabled={!!inCart}
                                                                >
                                                                    +
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="flex justify-between items-center mt-4 text-sm">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            <span className="text-gray-600">
                                                Page {currentPage} of {totalPages}
                                            </span>

                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>

                                    </div>
                                </div>


                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">Selected Products</h3>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-300">
                                                <tr>
                                                    <th className="text-left px-3 py-3 text-sm font-medium text-gray-700">Product name</th>
                                                    <th className="text-center px-2 py-3 text-sm font-medium text-gray-700">Qty</th>
                                                    <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Price</th>
                                                    <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Total</th>
                                                    <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Deduction</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {cart.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                            No products selected
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {cart.map((item) => {
                                                            const total = item.price * item.quantity;
                                                            const deduction = (total * item.discountPercentage) / 100;
                                                            return (
                                                                <tr key={item.id} className="hover:bg-gray-50">
                                                                    <td className="px-3 py-3 text-sm text-gray-600">{item.title}</td>
                                                                    <td className="px-2 py-3 text-center">
                                                                        <input
                                                                            type="text"
                                                                            value={item.quantity}
                                                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                                                            className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                                                        />
                                                                    </td>
                                                                    <td className="px-3 py-3 text-sm text-gray-600 text-right">
                                                                        {item.price.toFixed(0)} kes
                                                                    </td>
                                                                    <td className="px-3 py-3 text-sm text-gray-600 text-right">
                                                                        {total.toFixed(0)} kes
                                                                    </td>
                                                                    <td className="px-3 py-3 text-right">
                                                                        <input
                                                                            type="text"
                                                                            value={deduction.toFixed(0)}
                                                                            readOnly
                                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-gray-50"
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-3 text-center">
                                                                        <button
                                                                            onClick={() => decreaseQuantity(item.id)}
                                                                            className="w-6 h-6 rounded-full border border-gray-400 hover:border-red-500 hover:text-red-500 flex items-center justify-center text-gray-600 text-sm"
                                                                        >
                                                                            −
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
                                                            <td colSpan={4} className="px-3 py-3 text-sm text-gray-800">Total</td>
                                                            <td className="px-3 py-3 text-sm text-gray-800 text-right">
                                                                {calculateTotalDeduction().toFixed(0)} kes
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-6 flex justify-between items-center">
                                <button className="px-8 py-3 border border-gray-400 rounded hover:bg-gray-50 text-gray-700 font-medium">
                                    Back
                                </button>
                                {/* <button
                                    onClick={handlePayment}
                                    disabled={cart.length === 0 || calculateTotalDeduction() > walletBalance}
                                    className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Deduct {calculateTotalDeduction().toFixed(2)} Kes
                                </button> */}
                                <button
                                    onClick={handleProceedToSummary}
                                    disabled={cart.length === 0}
                                    className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Proceed • Subsidy {calculateTotalDeduction().toFixed(0)} Kes
                                </button>
                            </div>


                            {cart.length > 0 && (
                                <div className="mt-4 text-center text-red-600 text-sm">
                                    You will receive {calculateTotalDeduction().toFixed(2)} kes from the subsidy program. If this does not cover the total cost of the purchase ensure you get the balance from the customer.
                                </div>
                            )}
                            <ConfirmationModal show={showConfirmation} />

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;