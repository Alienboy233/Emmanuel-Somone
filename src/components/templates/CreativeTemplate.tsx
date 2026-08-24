import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';

interface TemplateProps {
  invoice: Invoice;
  business: BusinessProfile;
  previewMode?: boolean;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ invoice, business }) => {
  const primaryColor = invoice.themeColor || '#d946ef'; // Fuchsia / Creative Magenta
  const secondaryColor = invoice.secondaryColor || '#8b5cf6'; // Violet
  const statusInfo = getStatusBadgeInfo(invoice.status);

  return (
    <div
      id="invoice-document"
      className="bg-white text-slate-800 max-w-4xl mx-auto rounded-3xl shadow-xl border border-pink-100 overflow-hidden font-sans p-8 sm:p-12 print:shadow-none print:border-none print:m-0"
      style={{ fontFamily: invoice.fontFamily || 'Space Grotesk, sans-serif' }}
    >
      {/* Creative Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {business.logo && (
              <img
                src={business.logo}
                alt={business.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-purple-400/40"
                referrerPolicy="no-referrer"
              />
            )}
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              Creative Studio Bill
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{business.name}</h1>
          <p className="text-xs text-slate-500 font-medium">{business.tagline}</p>
          <div className="text-xs text-slate-600 mt-2 space-y-0.5">
            <p>{business.address}</p>
            <p className="font-mono">{business.phone} &bull; {business.email}</p>
            {business.taxNumber && <p className="text-slate-400 font-mono">TIN: {business.taxNumber}</p>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice Ref</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {invoice.invoiceNumber}
          </p>
          <div className="mt-3 flex sm:justify-end gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${statusInfo.bgClass} ${statusInfo.textClass} ${statusInfo.borderClass}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 space-y-0.5">
            <p>Date: <span className="font-semibold text-slate-700">{formatDate(invoice.invoiceDate)}</span></p>
            <p>Due: <span className="font-semibold text-slate-900">{formatDate(invoice.dueDate)}</span></p>
          </div>
        </div>
      </div>

      {/* Client & Project Specs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8">
        <div className="md:col-span-7 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
          <span className="text-[11px] font-black uppercase tracking-widest text-purple-700 block mb-1">
            Client / Creative Partner
          </span>
          <h2 className="text-xl font-black text-slate-900">{invoice.clientName}</h2>
          {invoice.clientCompanyName && (
            <p className="text-sm font-bold text-purple-900">{invoice.clientCompanyName}</p>
          )}
          {invoice.clientAddress && (
            <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{invoice.clientAddress}</p>
          )}
          <div className="text-xs text-slate-600 mt-2 font-mono space-y-0.5">
            {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
            {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-1">
              Payment Terms & Currency
            </span>
            <p className="text-xs text-slate-300">
              {invoice.terms || business.defaultPaymentTerms}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
            <span className="text-xs text-slate-400">Total Billed:</span>
            <span className="text-xl font-black text-pink-400 font-mono">
              {formatCurrency(invoice.grandTotal, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="my-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-900">
              <th className="py-3 pr-4">Scope of Work / Deliverables</th>
              <th className="py-3 px-3 text-center">Qty</th>
              <th className="py-3 px-3 text-right">Rate</th>
              {invoice.items.some((i) => i.discount > 0) && (
                <th className="py-3 px-3 text-right">Disc</th>
              )}
              <th className="py-3 pl-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {invoice.items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-pink-50/30 transition-colors">
                <td className="py-4 pr-4">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                    {item.description}
                  </div>
                  {item.category && (
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block ml-3.5 mt-0.5">
                      [{item.category}]
                    </span>
                  )}
                  {item.specifications && (
                    <p className="text-[11px] text-slate-500 ml-3.5 mt-1 leading-relaxed">
                      {item.specifications}
                    </p>
                  )}
                </td>
                <td className="py-4 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                <td className="py-4 px-3 text-right font-mono text-slate-700">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                {invoice.items.some((i) => i.discount > 0) && (
                  <td className="py-4 px-3 text-right font-mono text-pink-600 font-bold">
                    {item.discount > 0 ? `-${item.discount}%` : '—'}
                  </td>
                )}
                <td className="py-4 pl-4 text-right font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Channels & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t-2 border-slate-900">
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Payment Instructions (Ghana & Wire)
            </h3>
            {business.mobileMoneyDetails.accounts && (
              <div className="space-y-1.5 text-xs">
                {business.mobileMoneyDetails.accounts.map((acc, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-200/60 font-mono">
                    <span className="font-sans font-semibold text-slate-700">{acc.provider}:</span>
                    <span className="font-bold text-slate-900">{acc.accountNumber} ({acc.accountName})</span>
                  </div>
                ))}
              </div>
            )}
            {business.bankDetails?.accountNumber && (
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p><span className="font-semibold">Bank:</span> {business.bankDetails.bankName}</p>
                <p><span className="font-semibold">Account:</span> {business.bankDetails.accountName} - <span className="font-mono font-bold">{business.bankDetails.accountNumber}</span></p>
              </div>
            )}
          </div>
          {invoice.notes && (
            <p className="text-xs text-slate-500 italic">{invoice.notes}</p>
          )}
        </div>

        <div className="md:col-span-5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 py-1">
            <span>Subtotal</span>
            <span className="font-mono font-bold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.discountTotal > 0 && (
            <div className="flex justify-between text-pink-600 py-1">
              <span>Discounts Applied</span>
              <span className="font-mono font-bold">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
            </div>
          )}
          {invoice.taxTotal > 0 && (
            <div className="flex justify-between text-slate-600 py-1">
              <span>{business.defaultTaxLabel || 'Tax / VAT (15%)'}</span>
              <span className="font-mono font-bold">+{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 border-t-2 border-slate-900 pt-2">
            <span>Grand Total</span>
            <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
          </div>
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold py-1">
              <span>Paid to Date</span>
              <span className="font-mono">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
          )}
          <div
            className="p-4 rounded-2xl text-white flex justify-between items-baseline font-mono shadow-md mt-3"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            <span className="text-xs font-sans font-bold uppercase tracking-wider">Balance Due</span>
            <span className="text-xl font-black">
              {formatCurrency(invoice.balanceDue, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        <p className="font-bold text-slate-700">{business.customFooterText || 'Designed with Passion. Crafted with Precision.'}</p>
      </div>
    </div>
  );
};
