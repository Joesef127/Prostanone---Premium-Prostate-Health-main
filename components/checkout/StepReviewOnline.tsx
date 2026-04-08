import React from 'react';
import { ChevronLeft, CheckCircle, Lock } from 'lucide-react';
import Button from '../Button';

interface Props {
  subtotal: number;
  finalDeliveryFee: number;
  total: number;
  state: string;
  gatewayChoice: 'korapay' | 'payaza' | null;
  loading: boolean;
  onSubmit: React.FormEventHandler;
  onBack: () => void;
}

const StepReviewOnline: React.FC<Props> = ({
  subtotal,
  finalDeliveryFee,
  total,
  state,
  gatewayChoice,
  loading,
  onSubmit,
  onBack,
}) => (
  <>
    <div className="flex items-center gap-2 mb-6">
      <button
        type="button"
        onClick={onBack}
        className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
      >
        <ChevronLeft />
      </button>
      <h2 className="text-2xl font-bold">Review & Pay</h2>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl mb-6">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium text-gray-800">₦{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center mb-4 text-sm border-b pb-4 border-gray-200">
        <span className="text-gray-600">Delivery Fee ({state})</span>
        <span className="font-medium text-gray-800">
          {finalDeliveryFee === 0 ? (
            <span className="text-green-600 font-bold">FREE</span>
          ) : (
            `₦${finalDeliveryFee.toLocaleString()}`
          )}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-gray-800 text-lg">Total Amount</span>
        <span className="text-2xl font-extrabold text-primary">₦{total.toLocaleString()}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">Includes taxes and shipping</p>
    </div>

    <div className="mb-8">
      <h3 className="font-semibold mb-4">Payment via {gatewayChoice === 'payaza' ? 'Payaza' : 'Korapay'}</h3>
      <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex items-center gap-4">
        <div className={`w-10 h-10 ${gatewayChoice === 'payaza' ? 'bg-green-600' : 'bg-blue-600'} rounded-md flex items-center justify-center text-white font-bold text-xs`}>
          {gatewayChoice === 'payaza' ? 'Pay' : 'Kora'}
        </div>
        <div>
          <p className="font-bold text-sm">Pay with {gatewayChoice === 'payaza' ? 'Payaza' : 'Korapay'}</p>
          <p className="text-xs text-gray-500">Cards, Transfer, USSD</p>
        </div>
        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
      </div>
    </div>

    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={loading}
        className="shadow-xl shadow-primary/20"
      >
        {loading ? 'Initializing Gateway...' : `Pay Securely ₦${total.toLocaleString()}`}
      </Button>
      <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1 mt-4">
        <Lock className="w-3 h-3" /> Secure 256-bit SSL Encrypted Payment
      </p>
    </form>
  </>
);

export default StepReviewOnline;
