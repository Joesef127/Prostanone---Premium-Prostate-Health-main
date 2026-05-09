import React from "react";
import { Shield } from "lucide-react";

interface TrustDeviceCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TrustDeviceCheckbox: React.FC<TrustDeviceCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-start gap-3 p-4 border border-border rounded-lg transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-surface/50"
      }`}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          if (!disabled) onChange(e.target.checked);
        }}
        disabled={disabled}
        className="w-4 h-4 text-primary rounded mt-0.5 disabled:cursor-not-allowed"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-primary" />
          <p className="font-medium text-sm text-text">Trust this device</p>
        </div>
        <p className="text-xs text-text-muted">
          You won't need a verification code on this device for the next 7 days
        </p>
      </div>
    </label>
  );
};

export default TrustDeviceCheckbox;
