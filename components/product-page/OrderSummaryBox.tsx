import React from 'react';
import type { ProductPackage } from '../../types';

interface Props {
  pkg: ProductPackage;
  deliveryFee: number;
  total: number;
  deliveryLabel: string;
}

const OrderSummaryBox: React.FC<Props> = ({ pkg, deliveryFee, total, deliveryLabel }) => (
  <>
    <div
      className={`text-sm font-semibold px-4 py-2.5 rounded-xl ${
        deliveryFee === 0 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
      }`}
    >
      {deliveryLabel}
    </div>

    <div className="bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
      <div className="flex justify-between text-gray-600 mb-1">
        <span>{pkg.name}</span>
        <span>₦{pkg.price.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-600 mb-2 border-b border-gray-200 pb-2">
        <span>Delivery</span>
        <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : ''}>
          {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
        </span>
      </div>
      <div className="flex justify-between font-extrabold text-secondary pt-1">
        <span>Total</span>
        <span>₦{total.toLocaleString()}</span>
      </div>
    </div>
  </>
);

export default OrderSummaryBox;
