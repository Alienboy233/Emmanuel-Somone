import React, { useState } from 'react';
import { Receipt, BusinessProfile } from '../../types';
import { ReceiptTemplate } from '../templates/ReceiptTemplate';
import { downloadElementAsPDF, printElement } from '../../utils/exportUtils';
import { generateReceiptWhatsAppMessage, formatCurrency, formatDate } from '../../utils/formatters';
import {
  X,
  Download,
  Printer,
  Share2,
  Mail,
  Receipt as ReceiptIcon,
  MessageCircle,
} from 'lucide-react';

interface ReceiptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
  business: BusinessProfile;
}

export const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({
  isOpen,
  onClose,
  receipt,
  business,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (!isOpen || !receipt) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadProgress(20);
    const success = await downloadElementAsPDF(
      'receipt-document',
      `Receipt_${receipt.receiptNumber}_${receipt.clientName.replace(/\s+/g, '_')}`,
      (progress) => setDownloadProgress(progress)
    );
    setIsDownloading(false);
    if (!success) {
      alert('Could not render PDF directly. You can use the Print option and choose Save as PDF.');
    }
  };

  const handlePrint = () => {
    printElement('receipt-document');
  };

  const handleWhatsAppShare = () => {
    const encoded = generateReceiptWhatsAppMessage(
      business.name,
      receipt.clientName,
      receipt.receiptNumber,
      formatCurrency(receipt.amountPaid, receipt.currency),
      formatCurrency(receipt.balanceRemaining, receipt.currency),
      formatDate(receipt.date)
    );

    const cleanPhone = (receipt.clientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Payment Receipt ${receipt.receiptNumber} from ${business.name}`);
    const body = encodeURIComponent(
      `Dear ${receipt.clientName},\n\nThank you for your payment of ${formatCurrency(
        receipt.amountPaid,
        receipt.currency
      )}.\nReceipt Number: ${receipt.receiptNumber}\nPayment Date: ${formatDate(
        receipt.date
      )}\nBalance Remaining: ${formatCurrency(
        receipt.balanceRemaining,
        receipt.currency
      )}\n\nBest regards,\n${business.name}`
    );
    window.open(`mailto:${receipt.clientEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[96vh]">
        {/* Control Header */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Payment Receipt Voucher ({receipt.receiptNumber})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? `Exporting (${downloadProgress}%)...` : 'Download PDF'}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Print Receipt"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>

            <button
              onClick={handleEmailShare}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Send via Email"
            >
              <Mail className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Receipt Document Canvas */}
        <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950 flex-1">
          <div className="w-full max-w-3xl">
            <ReceiptTemplate receipt={receipt} business={business} />
          </div>
        </div>
      </div>
    </div>
  );
};
