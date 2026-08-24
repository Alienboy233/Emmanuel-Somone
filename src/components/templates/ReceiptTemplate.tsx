import React from 'react';
import { Receipt, BusinessProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ReceiptTemplateProps {
  receipt: Receipt;
  business: BusinessProfile;
}

export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ receipt, business }) => {
  const primaryColor = receipt.themeColor || business.themeColor || '#4f46e5';

  return (
    <div
      id="receipt-document"
      className="bg-white text-slate-800 max-w-3xl mx-auto rounded-2xl shadow-lg border border-slate-200 overflow-hidden font-sans p-8 sm:p-12 print:shadow-none print:border-none print:m-0 print:p-4"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
        <div>
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="h-14 w-auto object-contain mb-3 rounded-lg"
              referrerPolicy="no-referrer"
            />
          )}
          <h1 className="text-2xl font-black text-slate-900">{business.name}</h1>
          <p className="text-xs text-slate-500 font-medium">{business.address}</p>
          <p className="text-xs text-slate-500 font-mono">
            {business.phone} &bull; {business.email}
          </p>
          {business.taxNumber && (
            <p className="text-xs text-slate-400 font-mono">TIN: {business.taxNumber}</p>
          )}
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            PAYMENT RECEIPT
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {receipt.receiptNumber}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Payment Date: <span className="font-bold text-slate-800">{formatDate(receipt.date)}</span>
          </p>
          {receipt.invoiceNumber && (
            <p className="text-xs font-semibold text-indigo-600 font-mono mt-0.5">
              Invoice Ref: {receipt.invoiceNumber}
            </p>
          )}
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            RECEIVED FROM
          </span>
          <h3 className="text-base font-black text-slate-900">{receipt.clientName}</h3>
          {receipt.clientPhone && (
            <p className="text-slate-600 font-mono mt-1">{receipt.clientPhone}</p>
          )}
          {receipt.clientEmail && <p className="text-slate-600">{receipt.clientEmail}</p>}
          {receipt.clientAddress && (
            <p className="text-slate-500 mt-1 whitespace-pre-line">{receipt.clientAddress}</p>
          )}
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            TRANSACTION METRICS
          </span>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Channel:</span>
            <span className="font-bold text-slate-900">{receipt.paymentMethod}</span>
          </div>
          {receipt.transactionReference && (
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Ref:</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {receipt.transactionReference}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span className="font-bold text-emerald-700">{receipt.paymentStatus}</span>
          </div>
        </div>
      </div>

      {/* Description & Amount Billed */}
      <div className="border border-slate-200 rounded-xl overflow-hidden my-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <tr>
              <th className="p-3.5">Payment For / Service Description</th>
              <th className="p-3.5 text-right">Payment Applied</th>
            </tr>
          </thead>
          <tbody>
            <tr className="divide-y divide-slate-100">
              <td className="p-4">
                <p className="font-bold text-slate-900 text-sm">{receipt.description}</p>
                {receipt.notes && (
                  <p className="text-xs text-slate-500 mt-1 italic">{receipt.notes}</p>
                )}
              </td>
              <td className="p-4 text-right font-mono font-black text-lg text-emerald-600">
                {formatCurrency(receipt.amountPaid, receipt.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Balance Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl my-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Official Payment Confirmation
          </span>
          <p className="text-sm text-slate-300">
            Total Invoice Valuation: <span className="font-mono text-white">{formatCurrency(receipt.totalAmount, receipt.currency)}</span>
          </p>
          <p className="text-xs text-slate-400">
            Amount Paid on this Voucher: <span className="font-mono text-emerald-300 font-bold">{formatCurrency(receipt.amountPaid, receipt.currency)}</span>
          </p>
        </div>

        <div className="text-center sm:text-right bg-slate-800/80 p-4 rounded-xl border border-slate-700 min-w-[220px]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Balance Remaining
          </span>
          <span className="text-2xl font-black font-mono text-amber-400">
            {formatCurrency(receipt.balanceRemaining, receipt.currency)}
          </span>
        </div>
      </div>

      {/* Official Seal / Signature block */}
      <div className="pt-6 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-700 font-bold px-4 py-1.5 rounded-lg uppercase tracking-widest rotate-[-2deg]">
            <span>PAID & VERIFIED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Voucher ID: {receipt.id}</p>
        </div>

        <div className="text-center sm:text-right">
          <p className="font-bold text-slate-800">{business.name}</p>
          <p className="text-[11px] text-slate-400">Authorized Accounts Department</p>
          <p className="text-[11px] text-slate-400 mt-1">Thank you for your prompt payment!</p>
        </div>
      </div>
    </div>
  );
};
