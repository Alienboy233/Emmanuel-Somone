import { CurrencyCode, InvoiceStatus, PaymentMethodType } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  GHS: 'GH₵',
  USD: '$',
  GBP: '£',
  EUR: '€',
  NGN: '₦',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  GHS: 'Ghana Cedi (GH₵)',
  USD: 'US Dollar ($)',
  GBP: 'British Pound (£)',
  EUR: 'Euro (€)',
  NGN: 'Nigerian Naira (₦)',
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'GHS'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || 'GH₵';
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return `${symbol} ${formattedNumber}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeInfo(status: InvoiceStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotColor: string;
} {
  switch (status) {
    case 'paid':
      return {
        label: 'Paid',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        borderClass: 'border-emerald-200 dark:border-emerald-800',
        dotColor: 'bg-emerald-500',
      };
    case 'partially_paid':
      return {
        label: 'Partially Paid',
        bgClass: 'bg-amber-50 dark:bg-amber-950/40',
        textClass: 'text-amber-700 dark:text-amber-300',
        borderClass: 'border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
      };
    case 'unpaid':
      return {
        label: 'Unpaid',
        bgClass: 'bg-rose-50 dark:bg-rose-950/40',
        textClass: 'text-rose-700 dark:text-rose-300',
        borderClass: 'border-rose-200 dark:border-rose-800',
        dotColor: 'bg-rose-500',
      };
    case 'sent':
      return {
        label: 'Sent',
        bgClass: 'bg-blue-50 dark:bg-blue-950/40',
        textClass: 'text-blue-700 dark:text-blue-300',
        borderClass: 'border-blue-200 dark:border-blue-800',
        dotColor: 'bg-blue-500',
      };
    case 'overdue':
      return {
        label: 'Overdue',
        bgClass: 'bg-red-50 dark:bg-red-950/50',
        textClass: 'text-red-700 dark:text-red-300',
        borderClass: 'border-red-300 dark:border-red-800',
        dotColor: 'bg-red-600',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bgClass: 'bg-slate-100 dark:bg-slate-800',
        textClass: 'text-slate-600 dark:text-slate-400',
        borderClass: 'border-slate-200 dark:border-slate-700',
        dotColor: 'bg-slate-400',
      };
    case 'draft':
    default:
      return {
        label: 'Draft',
        bgClass: 'bg-slate-100 dark:bg-slate-800/60',
        textClass: 'text-slate-700 dark:text-slate-300',
        borderClass: 'border-slate-200 dark:border-slate-700',
        dotColor: 'bg-slate-400',
      };
  }
}

export function generateNextNumber(prefix: string, sequence: number, padLength: number = 4): string {
  const currentYear = new Date().getFullYear();
  const sequencePadded = String(sequence).padStart(padLength, '0');
  return `${prefix}-${currentYear}-${sequencePadded}`;
}

export function generateWhatsAppMessage(
  businessName: string,
  clientName: string,
  invoiceNumber: string,
  totalAmount: string,
  balanceDue: string,
  dueDate: string,
  momoAccount?: string,
  momoName?: string
): string {
  let text = `Hello *${clientName}*,\n\n`;
  text += `Here is your invoice *${invoiceNumber}* from *${businessName}*:\n\n`;
  text += `📄 *Total Amount:* ${totalAmount}\n`;
  text += `💰 *Balance Due:* ${balanceDue}\n`;
  text += `📅 *Due Date:* ${dueDate}\n\n`;

  if (momoAccount) {
    text += `*Payment via Mobile Money:*\n`;
    text += `Number: *${momoAccount}*\n`;
    if (momoName) text += `Name: *${momoName}*\n`;
    text += `Reference: ${invoiceNumber}\n\n`;
  }

  text += `Thank you for your creative business with us!`;
  return encodeURIComponent(text);
}

export function generateReceiptWhatsAppMessage(
  businessName: string,
  clientName: string,
  receiptNumber: string,
  amountPaid: string,
  balanceRemaining: string,
  date: string
): string {
  let text = `Hello *${clientName}*,\n\n`;
  text += `Thank you for your payment! Here is your official payment receipt from *${businessName}*:\n\n`;
  text += `🧾 *Receipt No:* ${receiptNumber}\n`;
  text += `💵 *Amount Paid:* ${amountPaid}\n`;
  text += `💳 *Balance Remaining:* ${balanceRemaining}\n`;
  text += `📅 *Date:* ${date}\n\n`;
  text += `We appreciate your business!`;
  return encodeURIComponent(text);
}
