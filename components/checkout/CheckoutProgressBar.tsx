import React from 'react';
import { CheckCircle, User, MapPin, Truck, CreditCard } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Contact', icon: User },
  { id: 2, title: 'Shipping', icon: MapPin },
  { id: 3, title: 'Method', icon: Truck },
  { id: 4, title: 'Review', icon: CreditCard },
];

interface Props {
  currentStep: number;
}

const CheckoutProgressBar: React.FC<Props> = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" />
      <div
        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      />

      {STEPS.map(s => {
        const isActive = currentStep >= s.id;
        const isCurrent = currentStep === s.id;
        return (
          <div key={s.id} className="flex flex-col items-center bg-background px-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {isActive ? <CheckCircle className="w-5 h-5" /> : s.id}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary' : 'text-gray-500'}`}
            >
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default CheckoutProgressBar;
