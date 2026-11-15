"use client";

import { Toaster, toast } from "sonner";

/**
 * Centralized notification API across both Client Website and Admin Panel.
 * Customize styling, position, or library behavior from this single file.
 */
export const notify = {
  success: (message, description) =>
    toast.success(message, description ? { description } : undefined),
  error: (message, description) =>
    toast.error(message, description ? { description } : undefined),
  info: (message, description) =>
    toast.info(message, description ? { description } : undefined),
  warning: (message, description) =>
    toast.warning(message, description ? { description } : undefined),
  loading: (message, description) =>
    toast.loading(message, description ? { description } : undefined),
  dismiss: (id) => toast.dismiss(id),
};

/**
 * Global top-center Sonner toaster container mounted in RootLayout.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={3500}
      offset={16}
      toastOptions={{
        style: {
          borderRadius: "6px",
          fontFamily: "var(--font-outfit), 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        classNames: {
          toast: "rounded-[6px] shadow-xl border",
          title: "font-semibold text-xs sm:text-[13px]",
          description: "text-xs opacity-90",
        },
      }}
    />
  );
}

export default AppToaster;

