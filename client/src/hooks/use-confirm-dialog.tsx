import { useState } from "react";

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<unknown>(null);
  const [resolvePromise, setResolvePromise] =
    useState<(value: boolean) => void>();

  const confirm = (ctx?: unknown): Promise<boolean> => {
    setContext(ctx);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
  };

  return {
    isOpen,
    context,
    confirm,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };
}
