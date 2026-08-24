import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, Payment, Receipt, BusinessProfile, Client } from '../types';
import { formatDate, formatCurrency } from './formatters';

export async function downloadElementAsPDF(
  elementId: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    onProgress?.(20);
    
    // Render element to high quality canvas
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x retina quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.borderRadius = '0px';
          clonedEl.style.width = '800px';
          clonedEl.style.maxWidth = '800px';
        }
      },
    });

    onProgress?.(60);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if needed (multi-page invoices)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.(90);
    pdf.save(`${filename}.pdf`);
    onProgress?.(100);
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    return false;
  }
}

export function printElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((s) => s.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        ${styles}
        <style>
          body { background: white !important; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function exportInvoicesTaxCSV(invoices: Invoice[], business: BusinessProfile): void {
  const headers = [
    'Invoice Number',
    'Date',
    'Due Date',
    'Client Name',
    'Company',
    'Client TIN/Email',
    'Status',
    'Currency',
    'Subtotal',
    'Discount Total',
    'Tax Total (VAT/Levies)',
    'Grand Total',
    'Amount Paid',
    'Balance Due',
  ];

  const rows = invoices.map((inv) => [
    `"${inv.invoiceNumber}"`,
    `"${inv.invoiceDate}"`,
    `"${inv.dueDate}"`,
    `"${(inv.clientName || '').replace(/"/g, '""')}"`,
    `"${(inv.clientCompanyName || '').replace(/"/g, '""')}"`,
    `"${(inv.clientEmail || '').replace(/"/g, '""')}"`,
    `"${inv.status.toUpperCase()}"`,
    `"${inv.currency}"`,
    inv.subtotal.toFixed(2),
    inv.discountTotal.toFixed(2),
    inv.taxTotal.toFixed(2),
    inv.grandTotal.toFixed(2),
    inv.amountPaid.toFixed(2),
    inv.balanceDue.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `Tax_Invoices_Report_${business.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

export function exportPaymentsCSV(payments: Payment[]): void {
  const headers = [
    'Payment ID',
    'Invoice Number',
    'Receipt Number',
    'Client Name',
    'Payment Date',
    'Payment Method',
    'Transaction Ref',
    'Currency',
    'Amount Paid',
    'Notes',
  ];

  const rows = payments.map((p) => [
    `"${p.id}"`,
    `"${p.invoiceNumber}"`,
    `"${p.receiptNumber || 'N/A'}"`,
    `"${(p.clientName || '').replace(/"/g, '""')}"`,
    `"${p.paymentDate}"`,
    `"${p.paymentMethod}"`,
    `"${(p.transactionReference || '').replace(/"/g, '""')}"`,
    `"${p.currency}"`,
    p.amount.toFixed(2),
    `"${(p.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `Payments_Ledger_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

export function exportClientStatementCSV(client: Client, invoices: Invoice[], payments: Payment[]): void {
  const headers = ['Type', 'Doc Reference', 'Date', 'Description', 'Invoiced Amount', 'Paid Amount', 'Status'];

  const invoiceRows = invoices.map((inv) => [
    'Invoice',
    `"${inv.invoiceNumber}"`,
    `"${inv.invoiceDate}"`,
    `"${inv.items.map((i) => i.description).join('; ').replace(/"/g, '""')}"`,
    inv.grandTotal.toFixed(2),
    inv.amountPaid.toFixed(2),
    `"${inv.status.toUpperCase()}"`,
  ]);

  const paymentRows = payments.map((p) => [
    'Payment',
    `"${p.receiptNumber || p.id}"`,
    `"${p.paymentDate}"`,
    `"Payment via ${p.paymentMethod} (Ref: ${p.transactionReference || 'N/A'})"`,
    '0.00',
    p.amount.toFixed(2),
    '"CLEARED"',
  ]);

  const totalInvoiced = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalInvoiced - totalPaid;

  const summary = [
    '',
    '',
    '',
    '"TOTALS"',
    totalInvoiced.toFixed(2),
    totalPaid.toFixed(2),
    `"BALANCE DUE: ${balance.toFixed(2)}"`,
  ];

  const csvContent = [
    `"CLIENT STATEMENT: ${(client.name || '').replace(/"/g, '""')} (${(client.companyName || '').replace(/"/g, '""')})"`,
    `"Generated On: ${new Date().toLocaleDateString()}"`,
    '',
    headers.join(','),
    ...invoiceRows.map((r) => r.join(',')),
    ...paymentRows.map((r) => r.join(',')),
    summary.join(','),
  ].join('\n');

  downloadBlob(csvContent, `Statement_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
