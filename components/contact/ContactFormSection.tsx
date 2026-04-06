import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../Button';
import useContactForm from '../../hooks/useContactForm';

const ContactFormSection: React.FC = () => {
  const { form, errors, status, handleChange, handleSubmit, resetStatus } = useContactForm();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-6">Send us a Message</h3>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
          <CheckCircle className="text-success" size={48} />
          <h4 className="text-lg font-bold text-text">Message Sent!</h4>
          <p className="text-text-muted text-sm max-w-xs">
            Thanks for reaching out. We'll get back to you within 1 business day.
          </p>
          <button
            onClick={resetStatus}
            className="text-sm text-primary underline underline-offset-2 hover:text-secondary mt-2"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none bg-white ${
                errors.name ? 'border-error' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none bg-white ${
                errors.email ? 'border-error' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none bg-white resize-none ${
                errors.message ? 'border-error' : 'border-gray-200'
              }`}
            />
            {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-error text-sm bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />
              Something went wrong. Please try again or contact us via WhatsApp.
            </div>
          )}

          <Button type="submit" fullWidth size="lg" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Sending…
              </span>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactFormSection;
