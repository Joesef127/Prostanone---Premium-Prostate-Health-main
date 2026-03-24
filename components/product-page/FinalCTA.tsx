import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  CheckCircle,
} from "lucide-react";
import { images } from "@/lib";
import Button from "../Button";
import { FadeIn } from "./shared";
import { PACKAGES } from "../../lib/constants.ts";
import { NIGERIAN_STATES, calcDeliveryFee } from "../../utils/delivery";
import { useApp } from "../../context/AppContext";
declare global {
  interface Window {
    Korapay: any;
  }
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  packageId: string;
  state: string;
  address: string;
}

const defaultPackageId =
  PACKAGES.find((p) => p.badge === "RECOMMENDED")?.id ?? PACKAGES[0].id;

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  altPhone: "",
  email: "",
  packageId: defaultPackageId,
  state: "Lagos",
  address: "",
};

const FinalCTA: React.FC = () => {
  const navigate = useNavigate();
  const { paymentMethod, setPaymentMethod, gatewayChoice, setGatewayChoice } =
    useApp();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [reference] = useState(
    () => `PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  );
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const selectedPkg =
    PACKAGES.find((p) => p.id === form.packageId) ?? PACKAGES[0];

  const deliveryFee = useMemo(
    () => calcDeliveryFee(form.state, form.address, selectedPkg.containers),
    [form.state, form.address, selectedPkg.containers],
  );
  const total = selectedPkg.price + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validatePhone = (phone: string) =>
    /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/[\s-]/g, ""));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.firstName.trim().length < 2)
      errs.firstName = "Enter your first name";
    if (form.lastName.trim().length < 2) errs.lastName = "Enter your last name";
    if (!validatePhone(form.phone))
      errs.phone = "Enter a valid Nigerian number (e.g. 08012345678)";
    if (form.address.trim().length < 10)
      errs.address = "Enter a more detailed delivery address";
    setFieldErrors(errs);
    if (!paymentMethod) {
      alert("Please select a payment method before placing your order.");
      return false;
    }
    if (paymentMethod === "online" && !gatewayChoice) {
      alert("Please select a payment gateway to continue.");
      return false;
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);

    const WEBHOOK_URL =
      import.meta.env.VITE_ORDERS_WEBHOOK_URL ||
      "https://n8n.metrohyp.com/webhook/prostanone-orders";
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const paymentLabel =
      paymentMethod === "online" ? "Online Payment" : "Cash on Delivery (COD)";
    const checkoutStep =
      paymentMethod === "online"
        ? "korapay_payment_initiated"
        : "cod_order_placed";

    try {
      // Fire-and-forget for "Pay Online" — don't block navigation waiting on webhook
      const webhookPromise = fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          alt_phone: form.altPhone.trim(),
          shipping_address: `${form.address.trim()}, ${form.state}`,
          items_ordered: `1x ${selectedPkg.name} (₦${selectedPkg.price.toLocaleString()})`,
          delivery_fee: deliveryFee,
          total_amount: total,
          payment_method: paymentLabel,
          checkout_step: checkoutStep,
          date: new Date(new Date().getTime() + 60 * 60 * 1000)
            .toISOString()
            .replace("Z", "+01:00"),
        }),
      });

      if (paymentMethod === "online") {
        webhookPromise.catch(() => {});
        if (!window.Korapay) {
          alert("Payment gateway is loading. Please try again in a moment.");
          setLoading(false);
          return;
        }
        window.Korapay.initialize({
          key:
            import.meta.env.VITE_KORAPAY_PUBLIC_KEY ||
            "pk_test_qPwbCqQCurnRJCuhoQZTZxstUvpjsGqBbBq44bKZ",
          amount: total,
          currency: "NGN",
          reference,
          customer: {
            name: fullName,
            email:
              form.email.trim().toLowerCase() || "noreply@holisbotanicals.com",
          },
          onClose: () => setLoading(false),
          onSuccess: (_data: unknown) => {
            navigate("/thank-you", { state: { paymentMethod: "online" } });
          },
          onFailed: (_data: unknown) => {
            alert("Payment failed. Please try again.");
            setLoading(false);
          },
        });
        return;
      }

      // COD path — await webhook before redirect
      await webhookPromise;

      if (form.email.trim()) {
        fetch("https://formsubmit.co/ajax/sales@holisbotanicals.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New Prostanone COD Order - ${fullName}`,
            customer_name: fullName,
            customer_email: form.email.trim().toLowerCase(),
            customer_phone: form.phone.trim(),
            alt_phone: form.altPhone.trim(),
            shipping_address: `${form.address.trim()}, ${form.state}`,
            order_summary: `1x ${selectedPkg.name}`,
            delivery_fee: `₦${deliveryFee.toLocaleString()}`,
            total_amount: `₦${total.toLocaleString()}`,
            payment_method: "Cash on Delivery",
            _cc: form.email.trim().toLowerCase(),
            _template: "table",
          }),
        }).catch(() => {});
      }

      navigate("/thank-you", {
        state: { paymentMethod: "cod", phone: form.phone.trim() },
      });
    } catch {
      alert("Order submission failed. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors";
  const inputClass = (field: keyof FormState) =>
    fieldErrors[field]
      ? `${inputBase} border-red-400 bg-red-50 focus:ring-red-200`
      : `${inputBase} border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary/30 focus:border-primary`;

  const deliveryLabel =
    deliveryFee === 0
      ? "FREE delivery in your area!"
      : `Delivery fee: ${deliveryFee.toLocaleString()} (2-5 working days)`;

  return (
    <section
      id="order"
      className="py-20 bg-linear-to-br from-secondary via-primary to-[#3d0f2b] relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="inline-block mb-7 p-3.5 bg-white rounded-full"
          >
            <img
              src={images.nafdac_approved_badge}
              alt="NAFDAC Approved"
              className="h-20 mx-auto drop-shadow-xl"
            />
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-[1.1]">
            Your Prostate&apos;s Recovery Starts Here.
            <br />
            Start Healing <span className="text-accent">Today.</span>
          </h2>

          <div className="text-white text-center px-6">
            <div className="inline-block bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Limited Stock Available
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Place Your Order Now!
            </h2>
            <div className="flex justify-center gap-6 mt-3 text-sm font-medium text-white/80 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-green-400" />
                FREE delivery in Lagos (except for Epe and Badagry)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-400" /> Payment on
                Delivery
              </span>
            </div>
          </div>
        </FadeIn>

        <div id="order-form" className="bg-white rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass("firstName")}
                  placeholder="John"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass("lastName")}
                  placeholder="Doe"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                inputMode="numeric"
                className={inputClass("phone")}
                placeholder="e.g. 08012345678"
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alternative / WhatsApp Number
              </label>
              <input
                name="altPhone"
                value={form.altPhone}
                onChange={handleChange}
                type="tel"
                inputMode="numeric"
                className={inputClass("altPhone")}
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className={inputClass("email")}
                placeholder="Optional - for order confirmation"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Choose Your Order Quantity{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="packageId"
                value={form.packageId}
                onChange={handleChange}
                className={inputClass("packageId")}
              >
                {PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price.toLocaleString()} ({p.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass("state")}
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Exact Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className={inputClass("address")}
                placeholder="House No., Street, Area, City / LGA"
              />
              {fieldErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.address}
                </p>
              )}
            </div>

            <div
              className={`text-sm font-semibold px-4 py-2.5 rounded-xl ${
                deliveryFee === 0
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {deliveryLabel}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>{selectedPkg.name}</span>
                <span>₦{selectedPkg.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2 border-b border-gray-200 pb-2">
                <span>Delivery</span>
                <span
                  className={
                    deliveryFee === 0 ? "text-green-600 font-bold" : ""
                  }
                >
                  {deliveryFee === 0
                    ? "FREE"
                    : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-secondary pt-1">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    setGatewayChoice(null);
                  }}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Truck
                    size={20}
                    className={
                      paymentMethod === "cod" ? "text-primary" : "text-gray-400"
                    }
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Pay on Delivery
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Pay cash at your door
                  </span>
                  {paymentMethod === "cod" && (
                    <CheckCircle size={14} className="text-primary" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("online");
                    setGatewayChoice(null);
                  }}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard
                    size={20}
                    className={
                      paymentMethod === "online"
                        ? "text-primary"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Pay Online
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Card, Transfer, USSD
                  </span>
                  {paymentMethod === "online" && (
                    <CheckCircle size={14} className="text-primary" />
                  )}
                </button>
              </div>
            </div>

            {paymentMethod === "cod" && (
              <p className="text-[11px] text-red-600 leading-relaxed">
                <strong>PLEASE</strong> only proceed if you are READY and have
                the money to PAY ON DELIVERY. Each order submitted incurs a
                logistics fee. By submitting this form, you agree to receive a
                call from our team to confirm your order.
              </p>
            )}

            {paymentMethod === "online" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Select Gateway <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGatewayChoice("korapay")}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-center ${
                      gatewayChoice === "korapay"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard
                      size={18}
                      className={
                        gatewayChoice === "korapay"
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    />
                    <span className="text-xs font-bold text-gray-700">
                      Korapay
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Card, Transfer, USSD
                    </span>
                    {gatewayChoice === "korapay" && (
                      <CheckCircle size={13} className="text-primary" />
                    )}
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-3 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-1 opacity-50 cursor-not-allowed text-center"
                  >
                    <Lock size={18} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">
                      Payaza
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                      Coming Soon
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
                  <Lock size={11} className="shrink-0" />
                  Secured &amp; encrypted payment processing.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !paymentMethod ||
                (paymentMethod === "online" && !gatewayChoice)
              }
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />{" "}
                  {paymentMethod === "online"
                    ? "Processing..."
                    : "Submitting..."}
                </>
              ) : paymentMethod === "online" ? (
                <>
                  <CreditCard size={18} /> Pay Now —{" "}
                  {gatewayChoice === "korapay" ? "Korapay" : "Select Gateway"}
                </>
              ) : (
                "Place Order, Pay on Delivery"
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              NAFDAC Reg. No. A7-4976L. Nationwide Delivery Available
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
