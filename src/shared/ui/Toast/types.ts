export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  onUndo?: () => void;
  undoDuration?: number;
}

export interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
}
