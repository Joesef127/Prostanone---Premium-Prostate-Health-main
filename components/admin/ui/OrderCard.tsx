import React from "react";
import {
  ShoppingBag,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Hash,
} from "lucide-react";
import {
  formatCurrency,
  paymentStatusVariant,
  statusStyles,
  statusIcons,
} from "../adminCardHelpers";
import InfoRow from "./InfoRow";

interface OrderCardProps {
  row: Record<string, unknown>;
}

const OrderCard: React.FC<OrderCardProps> = ({ row }) => {
  const status = row.payment_status ?? row.paymentStatus;
  const variant = paymentStatusVariant(status);
  const total = row.total_amount ?? row.totalAmount;
  const items = row.items_ordered ?? row.itemsOrdered;
  const step = row.checkout_step ?? row.checkoutStep;
  const orderId = row.order_id ?? row.orderId;

  return (
    <>
      {/* header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text truncate leading-tight">
            {String(row.name ?? "—")}
          </p>
          <p className="text-xs text-text-muted truncate">
            {String(row.email ?? "—")}
          </p>
        </div>
        {total != null && (
          <p className="text-base font-bold text-primary shrink-0">
            {formatCurrency(total)}
          </p>
        )}
      </div>

      {/* status + step */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {status != null && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusStyles[variant]}`}
          >
            {statusIcons[variant]}
            {String(status).toUpperCase()}
          </span>
        )}
        {step != null && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-surface text-text-muted border-border">
            {String(step)}
          </span>
        )}
      </div>

      {/* details */}
      <div className="flex flex-col gap-1.5">
        {orderId != null && (
          <InfoRow icon={<Hash className="w-3.5 h-3.5" />}>
            <span className="font-mono text-xs sm:text-sm xl:text-base font-semibold text-primary">
              {String(orderId)}
            </span>
          </InfoRow>
        )}
        {row.phone != null && (
          <InfoRow icon={<Phone className="w-3.5 h-3.5" />}>
            <span className="whitespace-normal text-xs sm:text-sm">{String(row.phone)}</span>
          </InfoRow>
        )}
        {(row.shipping_address ?? row.shippingAddress) != null && (
          <InfoRow icon={<MapPin className="w-3.5 h-3.5" />}>
            <span className="whitespace-normal text-xs sm:text-sm">
              {String(row.shipping_address ?? row.shippingAddress)}
            </span>
          </InfoRow>
        )}
        {items != null && (
          <InfoRow icon={<Package className="w-3.5 h-3.5" />}>
            <span className="whitespace-normal text-xs sm:text-sm">{String(items)}</span>
          </InfoRow>
        )}
        {(row.payment_method ?? row.paymentMethod) != null && (
          <InfoRow icon={<CreditCard className="w-3.5 h-3.5" />}>
            <span className="whitespace-normal text-xs sm:text-sm">
              {String(row.payment_method ?? row.paymentMethod)}
            </span>
          </InfoRow>
        )}
      </div>
    </>
  );
};

export default OrderCard;
