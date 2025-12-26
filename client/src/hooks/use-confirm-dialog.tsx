import { useState, useCallback } from "react";

interface ConfirmOptions {
  title?: string;
  message?: string;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] =
    useState<(value: boolean) => void>();

  const confirm = useCallback((opts?: ConfirmOptions): Promise<boolean> => {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(true);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(false);
  }, [resolvePromise]);

  return {
    isOpen,
    title: options.title,
    message: options.message,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
