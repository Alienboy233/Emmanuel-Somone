import React, { useState, useMemo } from 'react';
import { Payment, BusinessProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadElementAsPDF } from '../../utils/exportUtils';
import {
  CreditCard,
  Search,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface PaymentsViewProps {
  payments: Payment[];
  business: BusinessProfile;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ payments, business }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchClient = p.clientName.toLowerCase().includes(q);
        const matchInv = (p.invoiceNumber || '').toLowerCase().includes(q);
        const matchTx = (p.transactionReference || '').toLowerCase().includes(q);
        const matchRec = (p.receiptNumber || '').toLowerCase().includes(q);
        if (!matchClient && !matchInv && !matchTx && !matchRec) return false;
      }
      return true;
    });
  }, [payments, methodFilter, searchTerm]);

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleExportCSV = () => {
    let csv = 'Payment ID,Receipt Number,Date,Client,Invoice Ref,Payment Method,Transaction Ref,Amount,Currency,Notes\n';
    filteredPayments.forEach((p) => {
      csv += `"${p.id}","${p.receiptNumber || ''}","${p.paymentDate}","${p.clientName}","${p.invoiceNumber || ''}","${p.paymentMethod}","${p.transactionReference || ''}",${p.amount},"${p.currency}","${p.notes || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Payments_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Payments Ledger & Inflow History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time audit log of all Mobile Money, wire transfers, and cash receipts
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          Export Payments CSV
        </button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Ledger Transactions
          </span>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {payments.length} Payments
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Total Inflow Collected
          </span>
          <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalCollected, business.currency)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Primary Channel
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {business.mobileMoneyDetails.primaryProvider || 'Mobile Money'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, tx ID, receipt #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter Method:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="all">All Methods</option>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="Telecel Cash">Telecel Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Payment Date</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Invoice Ref</th>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{formatDate(p.paymentDate)}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{p.clientName}</td>
                  <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {p.invoiceNumber || '—'}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    {p.receiptNumber || '—'}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">{p.paymentMethod}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {p.transactionReference || '—'}
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatCurrency(p.amount, p.currency)}
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <CreditCard className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No payment logs found</p>
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
