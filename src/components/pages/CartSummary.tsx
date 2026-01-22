// import React from 'react';
// import type { CartItem } from '../service/interface';

// interface CartSummaryProps {
//   cart: CartItem[];
//   walletBalance: number;
//   onDecreaseQuantity: (productId: number) => void;
//   onUpdateQuantity: (productId: number, value: string) => void;
//   onPayment: () => void;
// }

// const CartSummary: React.FC<CartSummaryProps> = ({
//   cart,
//   walletBalance,
//   onDecreaseQuantity,
//   onUpdateQuantity,
//   onPayment
// }) => {
//   const calculateTotal = (item: CartItem) => item.price * item.quantity;
//   const calculateDeduction = (item: CartItem) => 
//     (item.price * item.quantity * item.discountPercentage) / 100;
  
//   const totalDeduction = cart.reduce((sum, item) => sum + calculateDeduction(item), 0);

//   return (
//     <div>
//       <h3 className="font-semibold text-gray-800 mb-4">Selected Products</h3>
//       <div className="border border-gray-300 rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-300">
//             <tr>
//               <th className="text-left px-3 py-3 text-sm font-medium text-gray-700">Product name</th>
//               <th className="text-center px-2 py-3 text-sm font-medium text-gray-700">Qty</th>
//               <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Price</th>
//               <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Total</th>
//               <th className="text-right px-3 py-3 text-sm font-medium text-gray-700">Deduction</th>
//               <th className="w-10"></th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {cart.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
//                   No products selected
//                 </td>
//               </tr>
//             ) : (
//               <>
//                 {cart.map((item) => {
//                   const total = calculateTotal(item);
//                   const deduction = calculateDeduction(item);
//                   return (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-3 py-3 text-sm text-gray-600">{item.title}</td>
//                       <td className="px-2 py-3 text-center">
//                         <input
//                           type="text"
//                           value={item.quantity}
//                           onChange={(e) => onUpdateQuantity(item.id, e.target.value)}
//                           onKeyPress={(e) => {
//                             if (!/[0-9]/.test(e.key)) {
//                               e.preventDefault();
//                             }
//                           }}
//                           className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
//                         />
//                       </td>
//                       <td className="px-3 py-3 text-sm text-gray-600 text-right">
//                         {item.price.toFixed(0)} kes
//                       </td>
//                       <td className="px-3 py-3 text-sm text-gray-600 text-right">
//                         {total.toFixed(0)} kes
//                       </td>
//                       <td className="px-3 py-3 text-right">
//                         <input
//                           type="text"
//                           value={deduction.toFixed(0)}
//                           readOnly
//                           className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-gray-50"
//                         />
//                       </td>
//                       <td className="px-2 py-3 text-center">
//                         <button
//                           onClick={() => onDecreaseQuantity(item.id)}
//                           className="w-6 h-6 rounded-full border border-gray-400 hover:border-red-500 hover:text-red-500 flex items-center justify-center text-gray-600 text-sm"
//                         >
//                           −
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
//                   <td colSpan={4} className="px-3 py-3 text-sm text-gray-800">Total</td>
//                   <td className="px-3 py-3 text-sm text-gray-800 text-right">
//                     {totalDeduction.toFixed(0)} kes
//                   </td>
//                   <td></td>
//                 </tr>
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CartSummary;