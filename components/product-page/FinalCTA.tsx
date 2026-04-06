import React from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { PACKAGES, NAFDAC_REG_NO } from '../../lib/constants.ts';
import { STATE_DELIVERY_ZONES } from '../../utils/delivery';
import CustomDropdown from '../ui/CustomDropdown';
import { useFinalCTAForm } from '../../hooks/useFinalCTAForm';
import FormField from './FormField';
import OrderSummaryBox from './OrderSummaryBox';
import PaymentSelector from './PaymentSelector';
import CTAHero from './CTAHero';

const FinalCTA: React.FC = () => {
  const {
    form,
    fieldErrors,
    loading,
    paymentMethod,
    setPaymentMethod,
    gatewayChoice,
    setGatewayChoice,
    selectedPkg,
    deliveryFee,
    total,
    deliveryLabel,
    handleChange,
    handleSubmit,
    inputClass,
  } = useFinalCTAForm();

  return (
    <section
      id="order"
      className="py-20 bg-linear-to-br from-secondary via-primary to-[#3d0f2b] relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <CTAHero />

        <div id="order-form" className="bg-white rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" required error={fieldErrors.firstName}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass('firstName')}
                  placeholder="John"
                />
              </FormField>
              <FormField label="Last Name" required error={fieldErrors.lastName}>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass('lastName')}
                  placeholder="Doe"
                />
              </FormField>
            </div>

            <FormField label="Phone Number" required error={fieldErrors.phone}>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                inputMode="numeric"
                className={inputClass('phone')}
                placeholder="e.g. 08012345678"
              />
            </FormField>

            <FormField label="Alternative / WhatsApp Number">
              <input
                name="altPhone"
                value={form.altPhone}
                onChange={handleChange}
                type="tel"
                inputMode="numeric"
                className={inputClass('altPhone')}
                placeholder="Optional"
              />
            </FormField>

            <FormField label="Email Address">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className={inputClass('email')}
                placeholder="Optional - for order confirmation"
              />
            </FormField>

            <FormField label="Choose Your Order Quantity" required>
              <CustomDropdown
                value={form.packageId}
                onChange={(v) => handleChange({ target: { name: 'packageId', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                options={PACKAGES.map(p => ({
                  value: p.id,
                  label: `${p.name} - ₦${p.price.toLocaleString()} (${p.description})`,
                }))}
              />
            </FormField>

            <FormField label="Your State" required>
              <CustomDropdown
                value={form.state}
                onChange={(v) => handleChange({ target: { name: 'state', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                groups={STATE_DELIVERY_ZONES}
              />
            </FormField>

            <FormField label="Exact Delivery Address" required error={fieldErrors.address}>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className={inputClass('address')}
                placeholder="House No., Street, Area, City / LGA"
              />
            </FormField>

            <OrderSummaryBox
              pkg={selectedPkg}
              deliveryFee={deliveryFee}
              total={total}
              deliveryLabel={deliveryLabel}
            />

            <PaymentSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              gatewayChoice={gatewayChoice}
              setGatewayChoice={setGatewayChoice}
            />

            <button
              type="submit"
              disabled={loading || !paymentMethod || (paymentMethod === 'online' && !gatewayChoice)}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />{' '}
                  {paymentMethod === 'online' ? 'Processing...' : 'Submitting...'}
                </>
              ) : paymentMethod === 'online' ? (
                <>
                  <CreditCard size={18} /> Pay Now â€”{' '}
                  {gatewayChoice === 'korapay' ? 'Korapay' : 'Select Gateway'}
                </>
              ) : (
                'Place Order, Pay on Delivery'
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              NAFDAC Reg. No. {NAFDAC_REG_NO}. Nationwide Delivery Available
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
