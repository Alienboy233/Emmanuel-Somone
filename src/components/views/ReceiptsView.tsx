import React, { useState, useMemo } from 'react';
import { Receipt, BusinessProfile, PaymentMethodType } from '../../types';
import { formatCurrency, formatDate, generateReceiptWhatsAppMessage } from '../../utils/formatters';
import {
  Receipt as ReceiptIcon,
  Plus,
  Search,
  Eye,
  Download,
  Printer,
  MessageCircle,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface ReceiptsViewProps {
  receipts: Receipt[];
  business: BusinessProfile;
  onOpenCreateReceipt: () => void;
  onViewReceipt: (receipt: Receipt) => void;
}

export const ReceiptsView: React.FC<ReceiptsViewProps> = ({
  receipts,
  business,
  onOpenCreateReceipt,
  onViewReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredReceipts = useMemo(() => {
    return receipts.filter((rec) => {
      if (methodFilter !== 'all' && rec.paymentMethod !== methodFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchNum = rec.receiptNumber.toLowerCase().includes(q);
        const matchClient = rec.clientName.toLowerCase().includes(q);
        const matchInv = (rec.invoiceNumber || '').toLowerCase().includes(q);
        const matchTx = (rec.transactionReference || '').toLowerCase().includes(q);
        if (!matchNum && !matchClient && !matchInv && !matchTx) return false;
      }
      return true;
    });
  }, [receipts, methodFilter, searchTerm]);

  const totalReceiptsAmount = receipts.reduce((sum, r) => sum + (r.amountPaid || 0), 0);

  const handleWhatsApp = (receipt: Receipt) => {
    const text = generateReceiptWhatsAppMessage(
      business.name,
      receipt.clientName,
      receipt.receiptNumber,
      formatCurrency(receipt.amountPaid, receipt.currency),
      formatCurrency(receipt.balanceRemaining, receipt.currency),
      formatDate(receipt.date)
    );
    const cleanPhone = (receipt.clientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Receipts & Payment Vouchers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate and distribute verified payment receipts for design, print & signage jobs
          </p>
        </div>
        <button
          onClick={onOpenCreateReceipt}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          + Generate Receipt
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Receipts Issued
          </span>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {receipts.length} Vouchers
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Total Funds Verified
          </span>
          <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalReceiptsAmount, business.currency)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Avg Payment Size
          </span>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(receipts.length > 0 ? totalReceiptsAmount / receipts.length : 0, business.currency)}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by receipt #, client, or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Payment Channel:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="all">All Channels</option>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="Telecel Cash">Telecel Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Payment Date</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Invoice Ref</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Tx ID</th>
                <th className="p-3.5 text-right">Amount Paid</th>
                <th className="p-3.5 text-right">Bal. Remaining</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReceipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    <button onClick={() => onViewReceipt(rec)} className="hover:underline text-left">
                      {rec.receiptNumber}
                    </button>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{formatDate(rec.date)}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{rec.clientName}</td>
                  <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {rec.invoiceNumber || '—'}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">{rec.paymentMethod}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {rec.transactionReference || '—'}
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(rec.amountPaid, rec.currency)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    {formatCurrency(rec.balanceRemaining, rec.currency)}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewReceipt(rec)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(rec)}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <ReceiptIcon className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No receipts found</p>
                    <button
                      onClick={onOpenCreateReceipt}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                    >
                      + Generate Receipt
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
