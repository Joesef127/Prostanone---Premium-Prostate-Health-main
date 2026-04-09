import React from 'react';
import { ChevronLeft, Truck, ShieldCheck, Phone } from 'lucide-react';
import Button from '../Button';
import { PACKAGES } from '../../lib/constants';
import type { CartItem } from '../../types';

interface Props {
  cart: CartItem[];
  phone: string;
  state: string;
  finalDeliveryFee: number;
  total: number;
  loading: boolean;
  onSubmit: React.FormEventHandler;
  onBack: () => void;
}

const StepReviewCOD: React.FC<Props> = ({
  cart,
  phone,
  state,
  finalDeliveryFee,
  total,
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
      <h2 className="text-xl sm:text-2xl font-bold">Confirm Your Order</h2>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
        <Truck size={22} className="text-green-600" />
      </div>
      <div>
        <p className="font-bold text-green-800 mb-1">Pay on Delivery Selected</p>
        <p className="text-sm text-green-700 leading-relaxed">
          Once you confirm, our team will call you on <strong>{phone}</strong> to discuss delivery
          details and arrange a convenient delivery time.
        </p>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={16} className="text-amber-600" />
        <p className="font-semibold text-amber-800 text-sm">Delivery Terms & Conditions</p>
      </div>
      <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside leading-relaxed">
        <li>Our team will call you within 24 hours to confirm your order.</li>
        <li>Please ensure you are available to receive delivery and make full payment.</li>
        <li>Only place an order if you are ready and able to pay on delivery.</li>
        <li>Delivery timelines vary by state; our team will provide an accurate estimate.</li>
      </ul>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl mb-6">
      <h3 className="font-semibold text-sm mb-3 text-gray-700">Order Summary</h3>
      {cart.map(item => {
        const pkg = PACKAGES.find(p => p.id === item.packageId);
        return pkg ? (
          <div key={item.packageId} className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {item.quantity}× {pkg.name}
            </span>
            <span className="font-medium">₦{(pkg.price * item.quantity).toLocaleString()}</span>
          </div>
        ) : null;
      })}
      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
        <span className="text-gray-600 text-sm">Delivery ({state})</span>
        <span className="text-sm font-medium">
          {finalDeliveryFee === 0 ? (
            <span className="text-green-600 font-bold">FREE</span>
          ) : (
            `₦${finalDeliveryFee.toLocaleString()}`
          )}
        </span>
      </div>
      <div className="flex justify-between mt-2">
        <span className="font-bold text-gray-800 text-sm sm:text-base">Total</span>
        <span className="font-extrabold text-primary text-base sm:text-lg">₦{total.toLocaleString()}</span>
      </div>
    </div>

    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        fullWidth
        size="md"
        disabled={loading}
        className="shadow-xl shadow-primary/20"
      >
        {loading ? 'Submitting Order...' : 'Confirm Order — Pay on Delivery'}
      </Button>
      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        <Phone size={11} /> We'll call you to confirm delivery
      </p>
    </form>
  </>
);

export default StepReviewCOD;
