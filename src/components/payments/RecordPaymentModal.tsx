import React, { useState, useEffect } from 'react';
import { Invoice, PaymentMethodType, BusinessProfile, Receipt } from '../../types';
import { db } from '../../services/db';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle2,
  Receipt as ReceiptIcon,
  DollarSign,
  Calendar,
  FileCheck,
} from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  business: BusinessProfile;
  onPaymentRecorded: (result: { payment: any; receipt?: Receipt; updatedInvoice: Invoice }) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  business,
  onPaymentRecorded,
}) => {
  const [amount, setAmount] = useState<string>(invoice?.balanceDue?.toString() || '0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    (invoice?.paymentMethodPreference as PaymentMethodType) ||
      (business?.mobileMoneyDetails?.primaryProvider as PaymentMethodType) ||
      'MTN Mobile Money'
  );
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionReference, setTransactionReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [generateReceipt, setGenerateReceipt] = useState<boolean>(true);

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.balanceDue.toString());
      setNotes(`Payment for ${invoice.invoiceNumber}`);
      if (invoice.paymentMethodPreference) {
        setPaymentMethod(invoice.paymentMethodPreference as PaymentMethodType);
      }
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    try {
      const result = db.recordPayment({
        invoiceId: invoice.id,
        amount: numAmount,
        paymentMethod,
        paymentDate,
        transactionReference: transactionReference.trim() || undefined,
        notes: notes.trim() || undefined,
        generateReceipt,
      });

      // If fully paid, trigger celebration confetti
      if (result.updatedInvoice.status === 'paid') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      onPaymentRecorded(result);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const remainingAfterPayment = Math.max(0, invoice.balanceDue - parsedAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Record Payment against Invoice
            </h2>
            <p className="text-xs text-slate-500 font-mono">{invoice.invoiceNumber} &bull; {invoice.clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Summary Card */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Valuation</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                {formatCurrency(invoice.grandTotal, invoice.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Paid to Date</span>
              <span className="font-mono font-bold text-emerald-600 text-xs">
                {formatCurrency(invoice.amountPaid, invoice.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Outstanding</span>
              <span className="font-mono font-black text-rose-600 text-xs">
                {formatCurrency(invoice.balanceDue, invoice.currency)}
              </span>
            </div>
          </div>

          {/* Amount to Record */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Payment Amount ({invoice.currency}) *
              </label>
              <button
                type="button"
                onClick={() => setAmount(invoice.balanceDue.toString())}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Pay Full Balance ({formatCurrency(invoice.balanceDue, invoice.currency)})
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                max={invoice.balanceDue * 2} // allow slight overpayment or advance deposit
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
              <span>Projected Balance Remaining:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(remainingAfterPayment, invoice.currency)}
              </span>
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              >
                <option value="MTN Mobile Money">MTN Mobile Money</option>
                <option value="Telecel Cash">Telecel Cash</option>
                <option value="AirtelTigo Money">AirtelTigo Money</option>
                <option value="Bank Transfer">Direct Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Transaction Ref / MoMo Tx ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. MTN-TX-9948102 or Bank Wire #48291"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Internal / Receipt Notes
            </label>
            <input
              type="text"
              placeholder="e.g. 50% deposit received via MoMo"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Automatic Receipt Generation Checkbox */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptIcon className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-300 text-xs">
                  Generate Payment Receipt Voucher
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Assigns unique receipt # (e.g. {db.getNextReceiptNumber()}) with print & share link
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={generateReceipt}
              onChange={(e) => setGenerateReceipt(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Payment & Update Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
