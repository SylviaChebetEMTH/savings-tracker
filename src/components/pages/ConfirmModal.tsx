import React from "react";
import { CheckCircle } from "lucide-react";

interface ConfirmationModalProps {
  show: boolean;
  onClose?: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl px-8 py-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-sm text-gray-600">
          Your order has been confirmed.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationModal;

