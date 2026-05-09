import { AlertCircle } from "lucide-react";

const FormError = ({ error }: { error: string }) => {
  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );
};

export default FormError;
