import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ModalConfig } from '../types';

interface ModalContextValue {
  showAlert: (opts: Omit<Extract<ModalConfig, { kind: 'alert' }>, 'kind'>) => Promise<void>;
  showConfirm: (opts: Omit<Extract<ModalConfig, { kind: 'confirm' }>, 'kind'>) => Promise<boolean>;
  showPrompt: (opts: Omit<Extract<ModalConfig, { kind: 'prompt' }>, 'kind'>) => Promise<string | null>;
  showShare: (opts: Omit<Extract<ModalConfig, { kind: 'share' }>, 'kind'>) => Promise<void>;
  // Internal — consumed only by <Modal />
  _config: ModalConfig | null;
  _respond: (value: any) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [respondFn, setRespondFn] = useState<((v: any) => void) | null>(null);

  const open = useCallback(<T,>(cfg: ModalConfig): Promise<T> => {
    return new Promise<T>((resolve) => {
      // Wrap in arrow so React doesn't call it as an updater function
      setRespondFn(() => resolve);
      setConfig(cfg);
    });
  }, []);

  const respond = useCallback(
    (value: any) => {
      respondFn?.(value);
      setConfig(null);
      setRespondFn(null);
    },
    [respondFn],
  );

  const showAlert = useCallback(
    (opts: Omit<Extract<ModalConfig, { kind: 'alert' }>, 'kind'>) =>
      open<void>({ kind: 'alert', ...opts }),
    [open],
  );

  const showConfirm = useCallback(
    (opts: Omit<Extract<ModalConfig, { kind: 'confirm' }>, 'kind'>) =>
      open<boolean>({ kind: 'confirm', ...opts }),
    [open],
  );

  const showPrompt = useCallback(
    (opts: Omit<Extract<ModalConfig, { kind: 'prompt' }>, 'kind'>) =>
      open<string | null>({ kind: 'prompt', ...opts }),
    [open],
  );

  const showShare = useCallback(
    (opts: Omit<Extract<ModalConfig, { kind: 'share' }>, 'kind'>) =>
      open<void>({ kind: 'share', ...opts }),
    [open],
  );

  return (
    <ModalContext.Provider
      value={{ showAlert, showConfirm, showPrompt, showShare, _config: config, _respond: respond }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/** Use inside any React component or custom hook to show modals. */
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within <ModalProvider>');
  return {
    showAlert: ctx.showAlert,
    showConfirm: ctx.showConfirm,
    showPrompt: ctx.showPrompt,
    showShare: ctx.showShare,
  };
};

/** Internal hook used only by <Modal /> to read current config and respond. */
export const useModalInternal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModalInternal must be used within <ModalProvider>');
  return { config: ctx._config, respond: ctx._respond };
};
