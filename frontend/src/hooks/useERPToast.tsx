import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ToastMessage {
  id: number;
  text: string;
}

let toastId = 0;

export function useERPToast(autoDismissMs = 4000) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string) => {
      const id = ++toastId;
      setToasts([{ id, text }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, autoDismissMs);
    },
    [autoDismissMs],
  );

  const toastNode =
    toasts.length > 0
      ? createPortal(
          <div className="erp-toast-container no-print" aria-live="polite">
            {toasts.map((toast) => (
              <div key={toast.id} className="erp-toast erp-toast-success" role="status">
                {toast.text}
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return { showToast, toastNode };
}
