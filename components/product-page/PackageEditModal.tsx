import React, { useEffect } from "react";
import { X, Save, Package, Trash2 } from "lucide-react";
import { ProductPackage } from "../../types";
import { usePackageForm } from "../../hooks/usePackageForm";
import Button from "../Button";

interface Props {
  pkg: ProductPackage | null; // null = create mode
  onClose: () => void;
  onSaved: (updated: ProductPackage) => void;
  onDeleted?: (id: string) => void;
}

// ── Primitives ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-text text-xs sm:text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors " +
  "placeholder:text-text";

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1.5">
      {label}
      {hint && (
        <span className="normal-case font-normal ml-1 opacity-60">
          ({hint})
        </span>
      )}
    </label>
    {children}
  </div>
);

const Section: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 pt-1">
    <span className="text-[10px] font-bold uppercase tracking-widest text-text/50 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────

const PackageEditModal: React.FC<Props> = ({
  pkg,
  onClose,
  onSaved,
  onDeleted,
}) => {
  const { form, set, isEdit, saving, deleting, error, save, remove } =
    usePackageForm({
      pkg,
      onSaved,
      onDeleted,
      onClose,
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xs sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] mx-3 mb-5">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-text text-base leading-tight">
              {isEdit ? "Edit Package" : "Add New Package"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {isEdit ? pkg!.name : "Create a new pricing package"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-background transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Identity — create mode only */}
          {!isEdit && (
            <>
              <Section label="Identity" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Package ID" hint='e.g. "option-f"'>
                  <input
                    type="text"
                    value={form.id}
                    onChange={set("id")}
                    placeholder="option-f"
                    className={inputClass}
                  />
                </Field>
                <Field label="Boxes">
                  <input
                    type="number"
                    value={form.containers}
                    onChange={set("containers")}
                    min={1}
                    className={inputClass}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Basic info */}
          <Section label="Basic Info" />
          <Field label="Package Name">
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Option F · 6 Boxes"
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <input
              type="text"
              value={form.description}
              onChange={set("description")}
              placeholder="Short description shown on card"
              className={inputClass}
            />
          </Field>

          {/* Pricing */}
          <Section label="Pricing" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (₦)">
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                placeholder="45000"
                className={inputClass}
              />
            </Field>
            <Field label="Original Price (₦)" hint="optional">
              <input
                type="number"
                value={form.originalPrice}
                onChange={set("originalPrice")}
                placeholder="51000"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Savings Text" hint='e.g. "Save ₦6,000"'>
              <input
                type="text"
                value={form.savingsText}
                onChange={set("savingsText")}
                className={inputClass}
              />
            </Field>
            <Field label="Badge" hint='e.g. "BEST VALUE"'>
              <input
                type="text"
                value={form.badge}
                onChange={set("badge")}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Details */}
          <Section label="Details" />
          <Field label="Delivery Text">
            <input
              type="text"
              value={form.deliveryText}
              onChange={set("deliveryText")}
              className={inputClass}
            />
          </Field>
          <Field label="Usage Note">
            <input
              type="text"
              value={form.usageNote}
              onChange={set("usageNote")}
              className={inputClass}
            />
          </Field>
        </div>

        {/* ── Footer ── */}
        <div className="grid sm:grid-cols-2 sm:flex-row gap-3 px-6 py-4 border-t border-border bg-background shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-text-muted text-sm font-medium hover:text-text hover:border-gray-400 transition-colors"
          >
            Cancel
          </Button>
          <Button
            // variant="outline"
            size="sm"
            onClick={save}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Package"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageEditModal;
