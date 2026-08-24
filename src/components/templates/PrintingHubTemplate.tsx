import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';

interface TemplateProps {
  invoice: Invoice;
  business: BusinessProfile;
  previewMode?: boolean;
}

export const PrintingHubTemplate: React.FC<TemplateProps> = ({ invoice, business }) => {
  const primaryColor = invoice.themeColor || '#059669'; // Emerald
  const statusInfo = getStatusBadgeInfo(invoice.status);

  return (
    <div
      id="invoice-document"
      className="bg-white text-slate-900 max-w-4xl mx-auto rounded-xl shadow-md border-2 border-emerald-600/30 overflow-hidden font-sans p-8 sm:p-12 print:p-0 print:border-none print:shadow-none"
      style={{ fontFamily: invoice.fontFamily || 'DM Sans, sans-serif' }}
    >
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-emerald-600 pb-6 gap-6">
        <div className="flex items-start gap-4">
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="h-16 w-16 rounded-xl object-contain p-1 border border-slate-200 bg-white shadow-xs"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                PRINT & SIGNAGE ORDER INVOICE
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{business.name}</h1>
            <p className="text-xs text-slate-600">{business.tagline || 'Printing, Signage & Large Format Production'}</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {business.phone} | {business.email} | {business.address}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-left sm:text-right min-w-[200px]">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">JOB / INVOICE NUMBER</p>
          <p className="text-2xl font-black font-mono text-emerald-950">{invoice.invoiceNumber}</p>
          <div className="mt-2 text-xs space-y-0.5 text-slate-700">
            <p>Order Date: <span className="font-bold">{formatDate(invoice.invoiceDate)}</span></p>
            <p>Due / Collection: <span className="font-bold text-rose-700">{formatDate(invoice.dueDate)}</span></p>
            <p>Status: <span className="font-black uppercase text-emerald-800">{statusInfo.label}</span></p>
          </div>
        </div>
      </div>

      {/* Production Order & Client Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">CLIENT CONTACT</span>
          <p className="font-bold text-slate-900 text-sm">{invoice.clientName}</p>
          {invoice.clientCompanyName && <p className="font-semibold text-emerald-800">{invoice.clientCompanyName}</p>}
          <p className="text-slate-600 mt-1 font-mono">{invoice.clientPhone}</p>
          <p className="text-slate-600">{invoice.clientEmail}</p>
          {invoice.clientAddress && <p className="text-slate-500 mt-1">{invoice.clientAddress}</p>}
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">PRODUCTION DETAILS</span>
          <p className="text-slate-700"><span className="font-semibold">Turnaround:</span> Priority Print Queue</p>
          <p className="text-slate-700 mt-1"><span className="font-semibold">Proofing:</span> Digital PDF Proof Approved</p>
          <p className="text-slate-700 mt-1"><span className="font-semibold">Color Mode:</span> CMYK 300+ DPI</p>
          <p className="text-slate-700 mt-1"><span className="font-semibold">Packaging:</span> Shrinkwrapped / Boxed</p>
        </div>

        <div className="bg-emerald-900 text-white p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="font-bold text-emerald-300 uppercase text-[10px] block mb-1">GHANA MOMO PAYMENT</span>
            {business.mobileMoneyDetails.accounts?.[0] ? (
              <div className="font-mono text-xs space-y-0.5">
                <p className="font-bold">{business.mobileMoneyDetails.accounts[0].provider}</p>
                <p className="text-lg font-black text-amber-300">{business.mobileMoneyDetails.accounts[0].accountNumber}</p>
                <p className="text-[11px] text-emerald-200">{business.mobileMoneyDetails.accounts[0].accountName}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-300">Bank / MoMo details on request</p>
            )}
          </div>
          <p className="text-[10px] text-emerald-300 mt-2">Ref: {invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Print Job Specifications Item Table */}
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Job Item & Material Specs</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Rate</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {invoice.items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50">
                <td className="p-3">
                  <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                  {item.specifications && (
                    <div className="mt-1 bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] p-2 rounded font-mono">
                      <span className="font-bold">Specs: </span>{item.specifications}
                    </div>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    {item.category || 'Printing'}
                  </span>
                </td>
                <td className="p-3 text-center font-bold font-mono text-sm text-slate-800">
                  {item.quantity}
                </td>
                <td className="p-3 text-right font-mono text-slate-700">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Production Terms & Totals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t-2 border-slate-200 text-xs">
        <div className="md:col-span-7 space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 uppercase text-[10px] block mb-1">
              PRINT SHOP TERMS & COLLECTION POLICY
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">
              {invoice.terms || business.defaultInvoiceTerms}
            </p>
          </div>
          {invoice.notes && (
            <p className="text-[11px] text-slate-500 italic">Job Note: {invoice.notes}</p>
          )}
        </div>

        <div className="md:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Job Subtotal:</span>
            <span className="font-mono font-bold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.discountTotal > 0 && (
            <div className="flex justify-between text-rose-600">
              <span>Bulk / Promo Discount:</span>
              <span className="font-mono font-bold">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
            </div>
          )}
          {invoice.taxTotal > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{business.defaultTaxLabel || 'Tax / VAT (15%)'}:</span>
              <span className="font-mono font-bold">+{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
            </div>
          )}
          <div className="border-t border-slate-300 pt-2 flex justify-between font-black text-sm text-slate-900">
            <span>Total Production Cost:</span>
            <span className="font-mono text-emerald-800">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
          </div>
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Deposit / Paid:</span>
              <span className="font-mono">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
          )}
          <div className="border-t-2 border-emerald-700 pt-2 flex justify-between font-black text-base text-emerald-950">
            <span>Balance Due on Collection:</span>
            <span className="font-mono">{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 font-mono">
        <p>{business.customFooterText || 'AfroPixel Printing Hub — Precision Color, Guaranteed Quality.'}</p>
      </div>
    </div>
  );
};
