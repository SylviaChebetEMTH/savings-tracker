import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { CartItem } from '../service/interface';
import { useCart } from '../context/CartContext';
import ConfirmationModal from './ConfirmModal';

interface SummaryPageProps {
  onBack: () => void;
  onConfirmPayment: (verificationCode: string) => void;
  showSuccess?: boolean;
}

const SummaryPage: React.FC<SummaryPageProps> = ({
  onBack,
  onConfirmPayment,
  showSuccess = false,
}) => {
  const { cart, calculateTotalDeduction } = useCart();
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(90); // 1min 30sec


  const calculateTotal = (item: CartItem) => item.price * item.quantity;
  const calculateDeduction = (item: CartItem) =>
    Math.round((item.price * item.quantity * item.discountPercentage) / 100);

  const totalDeduction = calculateTotalDeduction();


  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/[0-9]/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const isCodeComplete = verificationCode.every(digit => digit !== '');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs < 10 ? '0' : ''}${secs}sec`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
   
      <header className="bg-gradient-to-r from-yellow-700 to-yellow-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Inua Mkulima Subsidy Program</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
       
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-yellow-700 hover:underline"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <span>Product Details</span>
            <span className="text-gray-400">›</span>
            <span className="font-medium text-gray-800">Summary</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Summary</h2>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Selected Products</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Product name</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-700">Quantity</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Price</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Total</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Deduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => {
                    const total = calculateTotal(item);
                    const deduction = calculateDeduction(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-700">{item.title}</td>
                        <td className="px-3 py-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-4 text-right text-gray-600">
                          {item.price.toFixed(0)} kes
                        </td>
                        <td className="px-4 py-4 text-right text-gray-600">
                          {total.toFixed(0)} kes
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-green-700">
                          {deduction.toFixed(0)} kes
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="px-4 py-4 text-gray-800">Total</td>
                    <td className="px-4 py-4 text-right text-gray-800">
                      {cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(0)} kes
                    </td>
                    <td className="px-4 py-4 text-right text-green-700">
                      {totalDeduction.toFixed(0)} kes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="mb-8">
            <p className="text-gray-700 mb-3">
              Enter the <strong>verification code</strong> sent to the parent at{' '}
              <span className="font-mono">072*******715</span> via SMS.
            </p>

            <div className="flex gap-3 mb-4">
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-600 focus:outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                disabled={!canResend}
                onClick={() => {
                  setCanResend(false);
                  setCountdown(90);
                  setVerificationCode(['', '', '', '', '', '']);
                }}
                className={`${
                  canResend ? 'text-yellow-700 hover:underline' : 'text-gray-400'
                }`}
              >
                Didn&apos;t receive OTP? Resend {canResend ? '' : `in ${formatTime(countdown)}`}
              </button>
            </div>
          </div>

         
          <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
            <button
              onClick={onBack}
              className="px-10 py-3 border border-gray-400 rounded-lg hover:bg-gray-50 text-gray-700 font-medium w-full sm:w-auto"
            >
              Back
            </button>
            <button
              onClick={() => onConfirmPayment(verificationCode.join(''))}
              disabled={!isCodeComplete}
              className="px-10 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Pay {totalDeduction.toFixed(0)} Kes
            </button>
          </div>

          {/* Warning */}
          <p className="mt-6 text-center text-red-600 text-sm">
            You will receive {totalDeduction.toFixed(2)} kes from the subsidy program. If this does
            not cover the total cost of the purchase ensure you get the balance from the customer.
          </p>
        </div>
      </div>

  
      <ConfirmationModal show={showSuccess} />
    </div>
  );
};

export default SummaryPage;

