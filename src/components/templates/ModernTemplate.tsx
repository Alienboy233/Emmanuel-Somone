import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';

interface TemplateProps {
  invoice: Invoice;
  business: BusinessProfile;
  previewMode?: boolean;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ invoice, business }) => {
  const primaryColor = invoice.themeColor || business.themeColor || '#4f46e5';
  const statusInfo = getStatusBadgeInfo(invoice.status);

  return (
    <div
      id="invoice-document"
      className="bg-white text-slate-800 max-w-4xl mx-auto rounded-2xl shadow-md border border-slate-200/80 overflow-hidden font-sans print:shadow-none print:border-none print:m-0"
      style={{ fontFamily: invoice.fontFamily || business.fontFamily || 'Outfit, sans-serif' }}
    >
      {/* Top Brand Banner */}
      <div
        className="p-8 text-white relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
        }}
      >
        <div className="flex items-center gap-4">
          {business.logo ? (
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <img
                src={business.logo}
                alt={business.name}
                className="h-12 w-12 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl backdrop-blur-xs">
              {business.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight">{business.name}</h1>
            {business.tagline && (
              <p className="text-xs text-white/80 font-medium">{business.tagline}</p>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 mb-1">
            INVOICE
          </div>
          <p className="text-2xl font-black font-mono tracking-tight text-white">
            {invoice.invoiceNumber}
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">
              ISSUED BY
            </span>
            <p className="font-bold text-slate-800">{business.name}</p>
            <p className="text-slate-600 mt-0.5">{business.address}</p>
            <p className="text-slate-600 mt-0.5">{business.phone}</p>
            <p className="text-slate-600">{business.email}</p>
            {business.taxNumber && (
              <p className="text-[11px] font-mono text-slate-500 mt-1">TIN: {business.taxNumber}</p>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">
              INVOICE FOR
            </span>
            <p className="font-bold text-slate-900 text-sm">{invoice.clientName}</p>
            {invoice.clientCompanyName && (
              <p className="font-semibold text-indigo-600">{invoice.clientCompanyName}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-slate-600 mt-0.5">{invoice.clientAddress}</p>
            )}
            {invoice.clientPhone && <p className="text-slate-600 mt-0.5">{invoice.clientPhone}</p>}
            {invoice.clientEmail && <p className="text-slate-600">{invoice.clientEmail}</p>}
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-3 md:pt-0">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Invoice Date:</span>
              <span className="font-bold text-slate-800">{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Due:</span>
              <span className="font-bold text-rose-600">{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status:</span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bgClass} ${statusInfo.textClass} ${statusInfo.borderClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500">Currency:</span>
              <span className="font-mono font-bold text-slate-700">{invoice.currency} ({invoice.currencySymbol})</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className="text-[11px] font-bold uppercase tracking-wider text-white rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <th className="py-3 px-4 rounded-l-lg">Item / Service Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                {invoice.items.some((i) => i.discount > 0) && (
                  <th className="py-3 px-3 text-right">Discount</th>
                )}
                <th className="py-3 px-4 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoice.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                    {item.category && (
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5 mr-2">
                        {item.category}
                      </span>
                    )}
                    {item.specifications && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.specifications}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  {invoice.items.some((i) => i.discount > 0) && (
                    <td className="py-3.5 px-3 text-right font-mono text-rose-500">
                      {item.discount > 0 ? `-${item.discount}%` : '—'}
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment & Totals */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
          {/* Payment & Bank Details */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Payment Channels & Instructions
              </h3>

              {/* Mobile Money Highlight */}
              {business.mobileMoneyDetails.accounts && business.mobileMoneyDetails.accounts.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-[11px] font-bold text-amber-700 block uppercase">
                    Ghana Mobile Money
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {business.mobileMoneyDetails.accounts.map((acc, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs shadow-xs"
                      >
                        <div className="font-bold text-slate-900">{acc.provider}</div>
                        <div className="font-mono text-slate-800 font-semibold">{acc.accountNumber}</div>
                        <div className="text-[10px] text-slate-500">{acc.accountName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {business.bankDetails?.accountNumber && (
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank:</span>
                    <span className="font-semibold text-slate-800">{business.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <span className="font-semibold text-slate-800">{business.bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account No:</span>
                    <span className="font-mono font-bold text-slate-900">{business.bankDetails.accountNumber}</span>
                  </div>
                  {business.bankDetails.branch && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Branch:</span>
                      <span className="text-slate-700">{business.bankDetails.branch}</span>
                    </div>
                  )}
                </div>
              )}

              {invoice.paymentInstructions && (
                <p className="text-[11px] text-slate-600 mt-2 italic leading-relaxed">
                  Note: {invoice.paymentInstructions}
                </p>
              )}
            </div>

            {invoice.notes && (
              <div className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">Special Notes:</span>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Totals Box */}
          <div className="md:col-span-5 flex flex-col justify-start">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Subtotal</span>
                <span className="font-mono text-white">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>

              {invoice.discountTotal > 0 && (
                <div className="flex justify-between text-xs text-rose-400">
                  <span>Discount</span>
                  <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
                </div>
              )}

              {invoice.taxTotal > 0 && (
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{business.defaultTaxLabel || 'Tax (VAT 15%)'}</span>
                  <span className="font-mono text-white">+{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
                </div>
              )}

              <div className="border-t border-slate-700 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-200">Grand Total</span>
                <span className="text-xl font-black font-mono text-white">
                  {formatCurrency(invoice.grandTotal, invoice.currency)}
                </span>
              </div>

              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-xs text-emerald-400 pt-1">
                  <span>Amount Paid</span>
                  <span className="font-mono">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
                </div>
              )}

              <div className="border-t border-slate-700/80 pt-3 flex justify-between items-baseline bg-slate-800/80 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <span className="font-bold text-sm text-amber-400">Balance Due</span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  {formatCurrency(invoice.balanceDue, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-600">{business.customFooterText || business.tagline}</p>
          <p className="text-[11px] text-slate-400">
            {business.website && <span className="mr-3">{business.website}</span>}
            {business.socialHandle && <span>{business.socialHandle}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
