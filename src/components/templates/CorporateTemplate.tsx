import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';

interface TemplateProps {
  invoice: Invoice;
  business: BusinessProfile;
  previewMode?: boolean;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ invoice, business }) => {
  const primaryColor = invoice.themeColor || '#0f172a'; // Slate Navy
  const statusInfo = getStatusBadgeInfo(invoice.status);

  return (
    <div
      id="invoice-document"
      className="bg-white text-slate-800 max-w-4xl mx-auto rounded-none shadow-sm border border-slate-300 font-serif p-10 sm:p-14 print:p-0 print:border-none print:shadow-none"
      style={{ fontFamily: invoice.fontFamily || 'Playfair Display, serif' }}
    >
      {/* Formal Header */}
      <div className="border-b-4 border-slate-900 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            {business.logo && (
              <img
                src={business.logo}
                alt={business.name}
                className="h-16 w-auto object-contain mb-3 grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
              {business.name}
            </h1>
            <p className="text-xs font-sans text-slate-600 max-w-sm mt-1">{business.address}</p>
            <p className="text-xs font-sans text-slate-600">
              Tel: {business.phone} | Email: {business.email}
            </p>
            {business.taxNumber && (
              <p className="text-xs font-mono text-slate-800 mt-1 font-semibold">
                Tax Identification Number (TIN): {business.taxNumber}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right font-sans">
            <h2 className="text-3xl font-black tracking-wider text-slate-900 uppercase">
              TAX INVOICE
            </h2>
            <p className="text-lg font-mono font-bold text-slate-800 mt-1">{invoice.invoiceNumber}</p>
            <div className="mt-3 text-xs space-y-1 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Date:</span>{' '}
                {formatDate(invoice.invoiceDate)}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Payment Due:</span>{' '}
                {formatDate(invoice.dueDate)}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Account Status:</span>{' '}
                <span className="uppercase font-bold text-slate-900">{statusInfo.label}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To & Remit Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 font-sans text-xs">
        <div className="border border-slate-200 p-4 rounded bg-slate-50/50">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
            CLIENT INFORMATION
          </span>
          <h3 className="text-sm font-bold text-slate-900">{invoice.clientName}</h3>
          {invoice.clientCompanyName && (
            <p className="font-semibold text-slate-800 mt-0.5">{invoice.clientCompanyName}</p>
          )}
          {invoice.clientAddress && (
            <p className="text-slate-600 mt-1 whitespace-pre-line">{invoice.clientAddress}</p>
          )}
          <p className="text-slate-600 mt-2">
            {invoice.clientPhone} &bull; {invoice.clientEmail}
          </p>
        </div>

        <div className="border border-slate-200 p-4 rounded bg-slate-50/50">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
            BANKING & REMITTANCE
          </span>
          <p className="font-bold text-slate-800">{business.bankDetails?.bankName}</p>
          <p className="text-slate-600">Account Name: {business.bankDetails?.accountName}</p>
          <p className="font-mono font-bold text-slate-900">
            Account No: {business.bankDetails?.accountNumber}
          </p>
          {business.bankDetails?.branch && (
            <p className="text-slate-600">Branch: {business.bankDetails.branch}</p>
          )}
          {business.mobileMoneyDetails.accounts?.[0] && (
            <p className="text-slate-700 mt-2 font-mono">
              MoMo: {business.mobileMoneyDetails.accounts[0].accountNumber} (
              {business.mobileMoneyDetails.accounts[0].accountName})
            </p>
          )}
        </div>
      </div>

      {/* Corporate Line Items Table */}
      <div className="my-8 font-sans">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
              <th className="p-3 border border-slate-400">#</th>
              <th className="p-3 border border-slate-400">Service / Item Description</th>
              <th className="p-3 border border-slate-400 text-center">Qty</th>
              <th className="p-3 border border-slate-400 text-right">Unit Price</th>
              <th className="p-3 border border-slate-400 text-right">Tax Rate</th>
              <th className="p-3 border border-slate-400 text-right">Amount ({invoice.currency})</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-200">
            {invoice.items.map((item, idx) => (
              <tr key={item.id || idx} className="border-b border-slate-200">
                <td className="p-3 border border-slate-200 text-slate-500 font-mono text-center">
                  {idx + 1}
                </td>
                <td className="p-3 border border-slate-200">
                  <p className="font-bold text-slate-900">{item.description}</p>
                  {item.specifications && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.specifications}</p>
                  )}
                </td>
                <td className="p-3 border border-slate-200 text-center font-bold text-slate-800">
                  {item.quantity}
                </td>
                <td className="p-3 border border-slate-200 text-right font-mono">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="p-3 border border-slate-200 text-right font-mono text-slate-600">
                  {item.taxRate || 15}%
                </td>
                <td className="p-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 font-sans text-xs">
        <div className="w-full sm:w-1/2 space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
              Terms & Legal Conditions
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">
              {invoice.terms || business.defaultInvoiceTerms}
            </p>
          </div>
          {invoice.notes && (
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                Authorization Notes
              </h4>
              <p className="text-slate-600 text-[11px] italic">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="w-full sm:w-80 border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{business.defaultTaxLabel || 'Tax / VAT (15%)'}:</span>
              <span className="font-mono">+{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.amountPaid > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Total Received:</span>
                <span className="font-mono">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
              </div>
            )}
          </div>
          <div className="bg-slate-900 text-white p-4 flex justify-between items-baseline">
            <span className="font-bold text-xs uppercase tracking-wider">Balance Due:</span>
            <span className="text-xl font-bold font-mono text-white">
              {formatCurrency(invoice.balanceDue, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Signature & Stamp Area */}
      <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 font-sans text-xs">
        <div>
          <p className="text-slate-500 mb-8">Authorized Representative Signature</p>
          <div className="w-48 border-b-2 border-slate-800" />
          <p className="font-bold text-slate-800 mt-1">{business.name}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-[11px]">Official Document Generated Electronically</p>
          <p className="text-slate-500 font-mono text-[10px] mt-1">Verification Hash: {invoice.id.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};
