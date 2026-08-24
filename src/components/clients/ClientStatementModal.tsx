import React, { useState } from 'react';
import { Client, Invoice, Payment, BusinessProfile } from '../../types';
import { db } from '../../services/db';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';
import { downloadElementAsPDF, printElement, exportClientStatementCSV } from '../../utils/exportUtils';
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
} from 'lucide-react';

interface ClientStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  business: BusinessProfile;
  invoices: Invoice[];
  payments: Payment[];
}

export const ClientStatementModal: React.FC<ClientStatementModalProps> = ({
  isOpen,
  onClose,
  client,
  business,
  invoices,
  payments,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !client) return null;

  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);

  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const totalPaid = clientPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstandingBalance = Math.max(0, totalInvoiced - totalPaid);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await downloadElementAsPDF(
      'client-statement-document',
      `Statement_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`
    );
    setIsDownloading(false);
  };

  const handlePrint = () => {
    printElement('client-statement-document');
  };

  const handleExportCSV = () => {
    exportClientStatementCSV(client, clientInvoices, clientPayments);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[96vh]">
        {/* Action Header */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Client Financial Statement & Ledger
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Generating...' : 'Download Statement PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Print Statement"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Canvas */}
        <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950 flex-1">
          <div
            id="client-statement-document"
            className="bg-white text-slate-800 w-full max-w-4xl p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200 font-sans print:shadow-none print:border-none print:m-0"
          >
            {/* Business & Statement Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
              <div>
                {business.logo && (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="h-12 w-auto object-contain mb-3 rounded"
                    referrerPolicy="no-referrer"
                  />
                )}
                <h1 className="text-xl font-bold text-slate-900">{business.name}</h1>
                <p className="text-xs text-slate-500">{business.address}</p>
                <p className="text-xs text-slate-500 font-mono">{business.phone} &bull; {business.email}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-slate-900 text-white rounded-full">
                  STATEMENT OF ACCOUNT
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Generated On: <span className="font-bold text-slate-800">{formatDate(new Date().toISOString())}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Currency: <span className="font-bold font-mono text-slate-800">{business.currency}</span>
                </p>
              </div>
            </div>

            {/* Client Snapshot & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8 text-xs">
              <div className="md:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  ACCOUNT HOLDER
                </span>
                <h3 className="text-base font-black text-slate-900">{client.name}</h3>
                {client.companyName && (
                  <p className="font-bold text-indigo-700 text-sm mt-0.5">{client.companyName}</p>
                )}
                <div className="mt-2 space-y-0.5 text-slate-600 font-mono">
                  <p>{client.phone}</p>
                  <p>{client.email}</p>
                  {client.address && <p className="font-sans text-slate-500">{client.address}</p>}
                </div>
              </div>

              <div className="md:col-span-6 grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Total Billed</span>
                  <span className="font-mono font-bold text-slate-900 text-sm mt-1">
                    {formatCurrency(totalInvoiced, business.currency)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{clientInvoices.length} invoices</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col justify-center text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Total Paid</span>
                  <span className="font-mono font-black text-emerald-700 text-sm mt-1">
                    {formatCurrency(totalPaid, business.currency)}
                  </span>
                  <span className="text-[10px] text-emerald-600 mt-0.5">{clientPayments.length} payments</span>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex flex-col justify-center text-center">
                  <span className="text-[10px] font-bold uppercase text-rose-700">Balance Due</span>
                  <span className="font-mono font-black text-rose-700 text-sm mt-1">
                    {formatCurrency(outstandingBalance, business.currency)}
                  </span>
                  <span className="text-[10px] text-rose-500 mt-0.5">
                    {outstandingBalance > 0 ? 'Outstanding' : 'Settled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoices History Table */}
            <div className="my-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-700" />
                Invoices History ({clientInvoices.length})
              </h4>
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Due Date</th>
                    <th className="p-2.5 text-right">Valuation</th>
                    <th className="p-2.5 text-right">Paid</th>
                    <th className="p-2.5 text-right">Balance</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientInvoices.map((inv) => {
                    const st = getStatusBadgeInfo(inv.status);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="p-2.5 text-slate-600">{formatDate(inv.invoiceDate)}</td>
                        <td className="p-2.5 text-slate-600">{formatDate(inv.dueDate)}</td>
                        <td className="p-2.5 text-right font-mono font-bold">
                          {formatCurrency(inv.grandTotal, inv.currency)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-emerald-700 font-semibold">
                          {formatCurrency(inv.amountPaid, inv.currency)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-black text-slate-900">
                          {formatCurrency(inv.balanceDue, inv.currency)}
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${st.bgClass} ${st.textClass} ${st.borderClass}`}
                          >
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {clientInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400">
                        No invoices generated for this client yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Payments History Table */}
            <div className="my-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-700" />
                Payment & Receipt Transactions ({clientPayments.length})
              </h4>
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-2.5">Receipt #</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Invoice Ref</th>
                    <th className="p-2.5">Channel</th>
                    <th className="p-2.5">Transaction Ref</th>
                    <th className="p-2.5 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-emerald-800">
                        {p.receiptNumber || 'REC-AUTO'}
                      </td>
                      <td className="p-2.5 text-slate-600">{formatDate(p.paymentDate)}</td>
                      <td className="p-2.5 font-mono text-slate-800 font-semibold">{p.invoiceNumber}</td>
                      <td className="p-2.5 text-slate-700">{p.paymentMethod}</td>
                      <td className="p-2.5 font-mono text-slate-500">{p.transactionReference || '—'}</td>
                      <td className="p-2.5 text-right font-mono font-black text-emerald-600">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                    </tr>
                  ))}
                  {clientPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        No payments recorded yet for this client.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
              <p>{business.customFooterText || 'For account queries, please contact accounts@' + (business.website || 'afropixelcreatives.com')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
