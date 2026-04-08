import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Truck, CreditCard, Lock } from 'lucide-react';
import Button from '../Button';

interface Props {
  paymentMethod: string | null;
  setPaymentMethod: (method: 'online' | 'cod') => void;
  gatewayChoice: 'korapay' | 'payaza' | null;
  setGatewayChoice: (g: 'korapay' | 'payaza' | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

const StepPaymentMethod: React.FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
  gatewayChoice,
  setGatewayChoice,
  onBack,
  onContinue,
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
      <h2 className="text-2xl font-bold">Select Payment Method</h2>
    </div>

    <p className="text-gray-500 text-sm mb-6">Choose how you'd like to pay for your order.</p>

    <div className="space-y-4 mb-8">
      <button
        type="button"
        onClick={() => setPaymentMethod('online')}
        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${
          paymentMethod === 'online'
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
          Kora
        </div>
        <div>
          <p className="font-bold text-sm">Pay Online</p>
          <p className="text-xs text-gray-500">Card, Bank Transfer, USSD — instant confirmation</p>
        </div>
        {paymentMethod === 'online' && (
          <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
        )}
      </button>

      {paymentMethod === 'online' && (
        <div className="space-y-2 pl-1">
          <p className="text-xs font-semibold text-gray-700">Select Gateway <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-2 gap-3">
            {(['korapay', 'payaza'] as const).map(gw => (
              <button
                key={gw}
                type="button"
                onClick={() => setGatewayChoice(gw)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-center ${
                  gatewayChoice === gw
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={18} className={gatewayChoice === gw ? 'text-primary' : 'text-gray-400'} />
                <span className="text-xs font-bold text-gray-700 capitalize">{gw}</span>
                <span className="text-[10px] text-gray-400">Card, Transfer, USSD</span>
                {gatewayChoice === gw && <CheckCircle size={13} className="text-primary" />}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
            <Lock size={11} className="shrink-0" /> Secured &amp; encrypted payment processing.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setPaymentMethod('cod')}
        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${
          paymentMethod === 'cod'
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <Truck size={22} />
        </div>
        <div>
          <p className="font-bold text-sm">Pay on Delivery</p>
          <p className="text-xs text-gray-500">Pay cash when your order arrives at your door</p>
        </div>
        {paymentMethod === 'cod' && (
          <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
        )}
      </button>
    </div>

    <Button
      type="button"
      fullWidth
      size="lg"
      disabled={!paymentMethod || (paymentMethod === 'online' && !gatewayChoice)}
      onClick={onContinue}
    >
      Continue <ChevronRight className="ml-2 w-4 h-4" />
    </Button>
  </>
);

export default StepPaymentMethod;
