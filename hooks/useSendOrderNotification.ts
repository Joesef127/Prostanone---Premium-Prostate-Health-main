/**
 * Hook for sending order confirmation emails via FormSubmit
 * Centralizes notification logic to avoid duplication across checkout flows
 */

export interface OrderNotificationData {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  itemsOrdered: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
}

export function useSendOrderNotification() {
  const sendNotification = async (data: OrderNotificationData) => {
    return fetch('https://formsubmit.co/ajax/sales@holisbotanicals.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `New Prostanone Order Confirmed (ID: ${data.orderId})`,
        order_id: data.orderId,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        shipping_address: data.shippingAddress,
        notes: data.notes || '',
        order_summary: data.itemsOrdered,
        subtotal_amount: `₦${data.subtotal.toLocaleString()}`,
        delivery_fee: `₦${data.deliveryFee.toLocaleString()}`,
        total_amount: `₦${data.total.toLocaleString()}`,
        _cc: data.email,
        _template: 'table',
      }),
    });
  };

  return { sendNotification };
}
