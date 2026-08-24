import React, { useState, useEffect } from 'react';
import { Invoice, BusinessProfile, TemplateStyle } from '../../types';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { downloadElementAsPDF, printElement } from '../../utils/exportUtils';
import { generateWhatsAppMessage, formatCurrency, formatDate } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Printer,
  Share2,
  Mail,
  CreditCard,
  Receipt as ReceiptIcon,
  Edit,
  Copy,
  Trash2,
  Palette,
  CheckCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  business: BusinessProfile;
  onEdit: (invoice: Invoice) => void;
  onDuplicate: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
  onOpenPaymentModal: (invoice: Invoice) => void;
  onGenerateReceipt?: (invoice: Invoice) => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  business,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenPaymentModal,
  onGenerateReceipt,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateStyle>(invoice?.template || 'modern');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (invoice?.template) {
      setActiveTemplate(invoice.template);
    }
  }, [invoice?.template]);

  if (!isOpen || !invoice) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadProgress(20);
    const success = await downloadElementAsPDF(
      'invoice-document',
      `Invoice_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}`,
      (progress) => setDownloadProgress(progress)
    );
    setIsDownloading(false);
    if (!success) {
      alert('Unable to generate PDF directly. You can use the Print button and choose "Save as PDF".');
    }
  };

  const handlePrint = () => {
    printElement('invoice-document');
  };

  const handleWhatsAppShare = () => {
    const primaryMomo = business.mobileMoneyDetails.accounts?.[0];
    const encoded = generateWhatsAppMessage(
      business.name,
      invoice.clientName,
      invoice.invoiceNumber,
      formatCurrency(invoice.grandTotal, invoice.currency),
      formatCurrency(invoice.balanceDue, invoice.currency),
      formatDate(invoice.dueDate),
      primaryMomo?.accountNumber,
      primaryMomo?.accountName
    );

    const cleanPhone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${business.name}`);
    const body = encodeURIComponent(
      `Dear ${invoice.clientName},\n\nPlease find the details for Invoice ${invoice.invoiceNumber} totaling ${formatCurrency(
        invoice.grandTotal,
        invoice.currency
      )}.\nBalance Due: ${formatCurrency(invoice.balanceDue, invoice.currency)}\nDue Date: ${formatDate(
        invoice.dueDate
      )}\n\nThank you for choosing ${business.name}!\n${business.phone} | ${business.email}`
    );
    window.open(`mailto:${invoice.clientEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const templatesList: { id: TemplateStyle; label: string }[] = [
    { id: 'modern', label: 'Modern' },
    { id: 'creative', label: 'Creative' },
    { id: 'printing-hub', label: 'Printing Hub' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'minimal', label: 'Minimal' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10">
          {/* Template Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
            <span className="px-2 text-slate-400 font-bold uppercase text-[10px] hidden sm:inline">
              Template:
            </span>
            {templatesList.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setActiveTemplate(tpl.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTemplate === tpl.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Record Payment Button if balance due */}
            {invoice.balanceDue > 0 && (
              <button
                onClick={() => onOpenPaymentModal(invoice)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Record Payment
              </button>
            )}

            {/* Direct Receipt generation */}
            {invoice.amountPaid > 0 && onGenerateReceipt && (
              <button
                onClick={() => onGenerateReceipt(invoice)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
              >
                <ReceiptIcon className="h-4 w-4" />
                View Receipts
              </button>
            )}

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? `Exporting (${downloadProgress}%)...` : 'Download PDF'}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Print Invoice"
            >
              <Printer className="h-4 w-4" />
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Share via WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>

            {/* Email Share */}
            <button
              onClick={handleEmailShare}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Send via Email"
            >
              <Mail className="h-4 w-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(invoice)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Edit Invoice"
            >
              <Edit className="h-4 w-4" />
            </button>

            {/* Duplicate */}
            <button
              onClick={() => onDuplicate(invoice.id)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Duplicate Invoice"
            >
              <Copy className="h-4 w-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Canvas Preview Area */}
        <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950 flex-1">
          <div className="w-full max-w-4xl transition-all">
            <TemplateRenderer
              invoice={invoice}
              business={business}
              overrideTemplate={activeTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
