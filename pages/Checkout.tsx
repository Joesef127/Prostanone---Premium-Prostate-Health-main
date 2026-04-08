import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckout } from '../hooks/useCheckout';
import Button from '../components/Button';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import CheckoutProgressBar from '../components/checkout/CheckoutProgressBar';
import StepContact from '../components/checkout/StepContact';
import StepShipping from '../components/checkout/StepShipping';
import StepPaymentMethod from '../components/checkout/StepPaymentMethod';
import StepReviewOnline from '../components/checkout/StepReviewOnline';
import StepReviewCOD from '../components/checkout/StepReviewCOD';

const slideVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const Checkout: React.FC = () => {
  useDynamicTitle('Checkout');
  const navigate = useNavigate();
  const {
    cart,
    formData,
    step,
    setStep,
    loading,
    paymentMethod,
    setPaymentMethod,
    gatewayChoice,
    setGatewayChoice,
    subtotal,
    finalDeliveryFee,
    total,
    handleInputChange,
    handleNext,
    handleBack,
    handlePayment,
    handleCODSubmit,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background px-4">
      <div className="max-w-3xl mx-auto">
        <CheckoutProgressBar currentStep={step} />

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...slideVariants}>
                <StepContact
                  formData={formData}
                  onChange={handleInputChange}
                  onSubmit={handleNext}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" {...slideVariants}>
                <StepShipping
                  formData={formData}
                  onChange={handleInputChange}
                  onSubmit={handleNext}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" {...slideVariants}>
                <StepPaymentMethod
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  gatewayChoice={gatewayChoice}
                  setGatewayChoice={setGatewayChoice}
                  onBack={handleBack}
                  onContinue={() => {
                    setStep(4);
                    window.scrollTo(0, 0);
                  }}
                />
              </motion.div>
            )}

            {step === 4 && paymentMethod === 'online' && (
              <motion.div key="step4-online" {...slideVariants}>
                <StepReviewOnline
                  subtotal={subtotal}
                  finalDeliveryFee={finalDeliveryFee}
                  total={total}
                  state={formData.state}
                  gatewayChoice={gatewayChoice}
                  loading={loading}
                  onSubmit={handlePayment}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {step === 4 && paymentMethod === 'cod' && (
              <motion.div key="step4-cod" {...slideVariants}>
                <StepReviewCOD
                  cart={cart}
                  phone={formData.phone}
                  state={formData.state}
                  finalDeliveryFee={finalDeliveryFee}
                  total={total}
                  loading={loading}
                  onSubmit={handleCODSubmit}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Checkout;