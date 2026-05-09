import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CodeCountdownProps {
  expiresAt: Date | null;
  onExpire?: () => void;
  showWarningAt?: number; // seconds (default: 60)
}

const CodeCountdown: React.FC<CodeCountdownProps> = ({
  expiresAt,
  onExpire,
  showWarningAt = 60,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const hasNotifiedExpire = useRef(false);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (!hasNotifiedExpire.current) {
          hasNotifiedExpire.current = true; // Ensure we only notify once
          onExpire?.();
        }
      } else {
        setTimeLeft(diff);
        setIsExpired(false);
        hasNotifiedExpire.current = false; // Reset for future expirations
      }
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!expiresAt) {
    return null;
  }

  if (isExpired) {
    return (
      <div className="flex gap-2 items-center text-xs sm:text-sm text-red-600 dark:text-red-400">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Code has expired</span>
      </div>
    );
  }

  const isWarning = timeLeft <= showWarningAt;

  return (
    <div
      className={`flex gap-2 items-center text-xs sm:text-sm font-medium transition-colors ${
        isWarning ? "text-red-600 dark:text-red-400" : "text-text-muted"
      }`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>
        ⏱️ Code expires in <strong>{formatTime(timeLeft)}</strong>
      </span>
    </div>
  );
};

export default CodeCountdown;
