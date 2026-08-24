import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';

interface TemplateProps {
  invoice: Invoice;
  business: BusinessProfile;
  previewMode?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ invoice, business }) => {
  const primaryColor = invoice.themeColor || business.themeColor || '#1e293b';
  const statusInfo = getStatusBadgeInfo(invoice.status);

  return (
    <div
      id="invoice-document"
      className="bg-white text-slate-800 p-8 sm:p-12 max-w-4xl mx-auto rounded-xl shadow-sm border border-slate-100 font-sans print:p-0 print:border-none print:shadow-none"
      style={{ fontFamily: invoice.fontFamily || business.fontFamily || 'Outfit, sans-serif' }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-8 gap-6">
        <div>
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="h-14 w-auto object-contain mb-3 rounded"
              referrerPolicy="no-referrer"
            />
          )}
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{business.name}</h1>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">{business.address}</p>
          <p className="text-xs text-slate-500 mt-1">
            {business.phone} &bull; {business.email}
          </p>
          {business.taxNumber && (
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">TIN: {business.taxNumber}</p>
          )}
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-block mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{
                backgroundColor: `${primaryColor}10`,
                borderColor: `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              Invoice
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {invoice.invoiceNumber}
          </p>
          <div className="mt-2 space-y-0.5 text-xs text-slate-500">
            <p>
              <span className="text-slate-400">Issue Date:</span> {formatDate(invoice.invoiceDate)}
            </p>
            <p>
              <span className="text-slate-400">Due Date:</span>{' '}
              <span className="font-semibold text-slate-700">{formatDate(invoice.dueDate)}</span>
            </p>
            <p>
              <span className="text-slate-400">Status:</span>{' '}
              <span className="font-medium text-slate-800 uppercase text-[11px]">{statusInfo.label}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 py-2">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Billed To
          </span>
          <h2 className="text-base font-bold text-slate-900">{invoice.clientName}</h2>
          {invoice.clientCompanyName && (
            <p className="text-xs font-medium text-slate-700">{invoice.clientCompanyName}</p>
          )}
          {invoice.clientAddress && (
            <p className="text-xs text-slate-500 mt-1 whitespace-pre-line">{invoice.clientAddress}</p>
          )}
          <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
            {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
            {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
          </div>
        </div>

        {invoice.paymentInstructions && (
          <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Payment Instructions
            </span>
            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
              {invoice.paymentInstructions}
            </p>
            {business.mobileMoneyDetails.accounts?.[0] && (
              <div className="mt-2 text-xs font-mono bg-white p-2 rounded border border-slate-200 text-slate-800">
                <span className="font-sans font-medium text-slate-500 block text-[10px]">
                  {business.mobileMoneyDetails.accounts[0].provider}:
                </span>
                {business.mobileMoneyDetails.accounts[0].accountNumber} (
                {business.mobileMoneyDetails.accounts[0].accountName})
              </div>
            )}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 px-3 text-center">Qty</th>
              <th className="pb-3 px-3 text-right">Price</th>
              {invoice.items.some((i) => i.discount > 0) && (
                <th className="pb-3 px-3 text-right">Disc</th>
              )}
              <th className="pb-3 pl-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {invoice.items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="py-3.5 pr-4">
                  <p className="font-semibold text-slate-800">{item.description}</p>
                  {item.specifications && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.specifications}</p>
                  )}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-600">{item.quantity}</td>
                <td className="py-3.5 px-3 text-right text-slate-600 font-mono">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                {invoice.items.some((i) => i.discount > 0) && (
                  <td className="py-3.5 px-3 text-right text-rose-500 font-mono">
                    {item.discount > 0 ? `-${item.discount}%` : '—'}
                  </td>
                )}
                <td className="py-3.5 pl-4 text-right font-semibold text-slate-900 font-mono">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="w-full sm:w-1/2 space-y-3">
          {invoice.notes && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Notes
              </span>
              <p className="text-xs text-slate-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Terms & Conditions
              </span>
              <p className="text-[11px] text-slate-500 whitespace-pre-line leading-relaxed">
                {invoice.terms}
              </p>
            </div>
          )}
        </div>

        <div className="w-full sm:w-80 space-y-2 bg-slate-50/60 p-4 rounded-lg border border-slate-100 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.discountTotal > 0 && (
            <div className="flex justify-between text-rose-600">
              <span>Total Discount</span>
              <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
            </div>
          )}
          {invoice.taxTotal > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{business.defaultTaxLabel || 'Tax (VAT)'}</span>
              <span className="font-mono">+{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
            <span>Grand Total</span>
            <span className="font-mono" style={{ color: primaryColor }}>
              {formatCurrency(invoice.grandTotal, invoice.currency)}
            </span>
          </div>
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Amount Paid</span>
              <span className="font-mono">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
            <span>Balance Due</span>
            <span className="font-mono text-slate-900">
              {formatCurrency(invoice.balanceDue, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        <p>{business.customFooterText || 'Thank you for your creative partnership.'}</p>
      </div>
    </div>
  );
};
