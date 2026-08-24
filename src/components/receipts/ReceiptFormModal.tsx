import React, { useState, useEffect } from 'react';
import { Receipt, Client, BusinessProfile, PaymentMethodType, Invoice } from '../../types';
import { db } from '../../services/db';
import { formatCurrency, CURRENCY_SYMBOLS } from '../../utils/formatters';
import { X, Receipt as ReceiptIcon, CheckCircle2, UserPlus } from 'lucide-react';

interface ReceiptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  business: BusinessProfile;
  invoices: Invoice[];
  onReceiptCreated: (receipt: Receipt) => void;
}

export const ReceiptFormModal: React.FC<ReceiptFormModalProps> = ({
  isOpen,
  onClose,
  clients,
  business,
  invoices,
  onReceiptCreated,
}) => {
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    (business.mobileMoneyDetails.primaryProvider as PaymentMethodType) || 'MTN Mobile Money'
  );
  const [transactionReference, setTransactionReference] = useState<string>('');
  const [description, setDescription] = useState<string>('Payment for creative design and print production services');
  const [amountPaid, setAmountPaid] = useState<string>('500');
  const [totalAmount, setTotalAmount] = useState<string>('500');
  const [notes, setNotes] = useState<string>('Thank you for your prompt business payment.');

  useEffect(() => {
    if (isOpen) {
      setReceiptNumber(db.getNextReceiptNumber());
    }
  }, [isOpen]);

  // When invoice selection changes, auto-populate client and amounts
  const handleInvoiceChange = (invId: string) => {
    setInvoiceId(invId);
    if (!invId) return;

    const selectedInv = invoices.find((i) => i.id === invId);
    if (selectedInv) {
      setClientId(selectedInv.clientId);
      setDescription(`Payment for Invoice ${selectedInv.invoiceNumber} (${selectedInv.items.map((i) => i.description).slice(0, 2).join(', ')})`);
      setTotalAmount(selectedInv.grandTotal.toString());
      setAmountPaid(selectedInv.balanceDue > 0 ? selectedInv.balanceDue.toString() : selectedInv.grandTotal.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      alert('Please select a client.');
      return;
    }

    const paidNum = parseFloat(amountPaid) || 0;
    const totalNum = parseFloat(totalAmount) || paidNum;
    const balanceRemaining = Math.max(0, totalNum - paidNum);

    const recNum = receiptNumber.trim() || db.getNextReceiptNumber();
    db.incrementReceiptSequence();

    let paymentStatusLabel: Receipt['paymentStatus'] = 'Deposit / Partial Payment';
    if (balanceRemaining <= 0.01) {
      paymentStatusLabel = 'Fully Paid';
    }

    const newReceipt: Receipt = {
      id: `rec_${Date.now()}`,
      businessId: business.id,
      receiptNumber: recNum,
      invoiceId: invoiceId || undefined,
      invoiceNumber: invoices.find((i) => i.id === invoiceId)?.invoiceNumber,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      clientAddress: client.address,
      date,
      paymentMethod,
      transactionReference: transactionReference.trim() || undefined,
      description,
      amountPaid: paidNum,
      totalAmount: totalNum,
      balanceRemaining,
      paymentStatus: paymentStatusLabel,
      notes,
      currency: business.currency,
      currencySymbol: CURRENCY_SYMBOLS[business.currency] || 'GH₵',
      template: business.defaultTemplate,
      createdAt: new Date().toISOString(),
    };

    const allReceipts = db.getReceipts();
    allReceipts.unshift(newReceipt);
    db.setReceipts(allReceipts);

    // If linked to invoice, also update invoice payment
    if (invoiceId) {
      const linkedInv = invoices.find((i) => i.id === invoiceId);
      if (linkedInv && linkedInv.balanceDue > 0) {
        db.recordPayment({
          invoiceId: linkedInv.id,
          amount: paidNum,
          paymentMethod,
          paymentDate: date,
          transactionReference,
          notes,
          generateReceipt: false, // already generated
        });
      }
    }

    onReceiptCreated(newReceipt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Generate Official Payment Receipt
            </h2>
            <p className="text-xs text-slate-500">Create a verified payment voucher for your client</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Number & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Receipt Number *
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Link to Invoice (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Link to Existing Invoice (Optional)
            </label>
            <select
              value={invoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="">-- Standalone Receipt (No Linked Invoice) --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.clientName} ({formatCurrency(inv.grandTotal, inv.currency)} - Bal: {formatCurrency(inv.balanceDue, inv.currency)})
                </option>
              ))}
            </select>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Client / Customer *
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
            >
              <option value="" disabled>-- Select client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Payment Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Payment Method & Reference */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Payment Channel *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                <option value="MTN Mobile Money">MTN Mobile Money</option>
                <option value="Telecel Cash">Telecel Cash</option>
                <option value="AirtelTigo Money">AirtelTigo Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Transaction / Tx ID
              </label>
              <input
                type="text"
                placeholder="e.g. MTN-994829"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Amount Paid ({business.currency}) *
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono font-bold text-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Total Job Valuation
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono font-bold text-slate-800 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Receipt Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex justify-end gap-2.5">
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
              Generate & Save Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
