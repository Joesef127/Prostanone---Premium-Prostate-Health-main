import React, { useState } from "react";
import Button from "../components/Button";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const SHEETS_WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      await fetch(SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          message: form.message.trim(),
          source: "Contact Form",
          date: new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
            .toISOString()
            .replace("Z", "+01:00"),
        }),
      });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-text-muted text-lg">
            Questions about Prostanone? Our team is here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6">
                Contact Channels
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text">
                      WhatsApp & Phone Support
                    </p>
                    <a
                      href="https://wa.me/2348155931140"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-bold mb-1 block"
                    >
                      08155931140
                    </a>
                    <p className="text-xs text-gray-400">
                      Mon-Sat, 9AM-6PM WAT
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text">Email</p>
                    <p className="text-text-muted">
                      <a href="mailto:support@holisbotanicals.com" className="hover:text-primary transition-colors">support@holisbotanicals.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6">
                Distributor Info
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-text mb-2">
                    Holis Botanical Gardens
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Distributed by Holis Botanical Gardens <br />
                    Lagos State, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6">
              Send us a Message
            </h3>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle className="text-success" size={48} />
                <h4 className="text-lg font-bold text-text">Message Sent!</h4>
                <p className="text-text-muted text-sm max-w-xs">
                  Thanks for reaching out. We'll get back to you within 1
                  business day.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-primary underline underline-offset-2 hover:text-secondary mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                      errors.name ? "border-error" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-error text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                      errors.email ? "border-error" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-error text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                      errors.message ? "border-error" : "border-gray-200"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-error text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-error text-sm bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle size={16} className="shrink-0" />
                    Something went wrong. Please try again or contact us via
                    WhatsApp.
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
