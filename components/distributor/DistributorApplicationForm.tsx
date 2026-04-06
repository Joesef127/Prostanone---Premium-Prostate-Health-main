import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from '../ui/FormFields';
import { BUSINESS_TYPES, MONTHLY_ORDER_QUANTITIES } from '../../lib/constants';
import { STATE_DELIVERY_ZONES } from '../../utils/delivery';
import { useDistributorForm } from '../../hooks/useDistributorForm';
import FadeIn from '../ui/FadeIn';

const DistributorApplicationForm: React.FC = () => {
  const { form, errors, status, handleChange, handleSubmit } = useDistributorForm();

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-secondary mb-3">Apply Now</h2>
            <p className="text-text-muted">
              Fill in the form below. Our team reviews applications within 2–3 business days.
            </p>
          </div>
        </FadeIn>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">Application Received!</h3>
            <p className="text-text-muted">
              Thank you for applying. We've sent a confirmation to{' '}
              <strong>{form.email || 'your email'}</strong>. Our team will review your application
              and reach out within 2–3 business days.
            </p>
          </motion.div>
        ) : (
          <FadeIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5"
            >
              <FormInput
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Chukwuemeka Okafor"
                required
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 -mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 08012345678"
                    required
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <FormSelect
                  label="State / Location"
                  name="state"
                  value={form.state}
                  onChange={(v) => handleChange({ target: { name: 'state', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                  groups={STATE_DELIVERY_ZONES}
                  required
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.state}
                  </p>
                )}
              </div>

              <div>
                <FormSelect
                  label="Business Type"
                  name="businessType"
                  value={form.businessType}
                  onChange={(v) => handleChange({ target: { name: 'businessType', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                  options={['', ...BUSINESS_TYPES]}
                  required
                />
                {errors.businessType && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.businessType}
                  </p>
                )}
              </div>

              <div>
                <FormSelect
                  label="Expected Monthly Order Quantity"
                  name="orderQuantity"
                  value={form.orderQuantity}
                  onChange={(v) => handleChange({ target: { name: 'orderQuantity', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                  options={['', ...MONTHLY_ORDER_QUANTITIES]}
                  required
                />
                {errors.orderQuantity && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.orderQuantity}
                  </p>
                )}
              </div>

              <FormTextarea
                label="Additional Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us a bit about your business, location, or any questions you have…"
                rows={4}
                optional
              />

              {status === 'error' && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    Something went wrong sending your application. Please try again or email us
                    directly at{' '}
                    <a href="mailto:sales@holisbotanicals.com" className="underline font-medium">
                      sales@holisbotanicals.com
                    </a>
                    .
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By submitting you agree to be contacted by Holis Botanical Gardens regarding your
                application.
              </p>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default DistributorApplicationForm;
