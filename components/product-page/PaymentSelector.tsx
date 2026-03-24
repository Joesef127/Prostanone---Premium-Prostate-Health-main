import React from 'react';
import { Truck, CreditCard, CheckCircle, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  paymentMethod: 'cod' | 'online' | null;
  setPaymentMethod: (m: 'cod' | 'online' | null) => void;
  gatewayChoice: 'korapay' | 'payaza' | null;
  setGatewayChoice: (g: 'korapay' | 'payaza' | null) => void;
}

interface PaymentOption {
  id: 'cod' | 'online';
  label: string;
  subtitle: string;
  Icon: LucideIcon;
}

interface GatewayOption {
  id: 'korapay' | 'payaza';
  label: string;
  subtitle: string;
  disabled?: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'cod', label: 'Pay on Delivery', subtitle: 'Pay cash at your door', Icon: Truck },
  { id: 'online', label: 'Pay Online', subtitle: 'Card, Transfer, USSD', Icon: CreditCard },
];

const GATEWAY_OPTIONS: GatewayOption[] = [
  { id: 'korapay', label: 'Korapay', subtitle: 'Card, Transfer, USSD' },
  { id: 'payaza', label: 'Payaza', subtitle: 'Coming Soon', disabled: true },
];

const PaymentSelector: React.FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
  gatewayChoice,
  setGatewayChoice,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Payment Method <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map(({ id, label, subtitle, Icon }) => {
          const active = paymentMethod === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPaymentMethod(id);
                setGatewayChoice(null);
              }}
              className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary' : 'text-gray-400'} />
              <span className="text-xs font-bold text-gray-700">{label}</span>
              <span className="text-[10px] text-gray-400">{subtitle}</span>
              {active && <CheckCircle size={14} className="text-primary" />}
            </button>
          );
        })}
      </div>
    </div>

    {paymentMethod === 'cod' && (
      <p className="text-[11px] text-red-600 leading-relaxed">
        <strong>PLEASE</strong> only proceed if you are READY and have the money to PAY ON
        DELIVERY. Each order submitted incurs a logistics fee. By submitting this form, you agree
        to receive a call from our team to confirm your order.
      </p>
    )}

    {paymentMethod === 'online' && (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700">
          Select Gateway <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {GATEWAY_OPTIONS.map(({ id, label, subtitle, disabled }) => {
            const active = gatewayChoice === id;
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={disabled ? undefined : () => setGatewayChoice(id)}
                className={
                  disabled
                    ? 'p-3 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-1 opacity-50 cursor-not-allowed text-center'
                    : `p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-center ${
                        active
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`
                }
              >
                {disabled ? (
                  <Lock size={18} className="text-gray-400" />
                ) : (
                  <CreditCard size={18} className={active ? 'text-primary' : 'text-gray-400'} />
                )}
                <span className="text-xs font-bold text-gray-700">{label}</span>
                {disabled ? (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                    {subtitle}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">{subtitle}</span>
                )}
                {active && !disabled && <CheckCircle size={13} className="text-primary" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
          <Lock size={11} className="shrink-0" /> Secured &amp; encrypted payment processing.
        </p>
      </div>
    )}
  </div>
);

export default PaymentSelector;
