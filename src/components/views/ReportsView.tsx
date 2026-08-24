import React, { useState } from 'react';
import { Invoice, Payment, Client, CreativeService, BusinessProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Users,
  Sparkles,
  PieChart as PieChartIcon,
  Receipt,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ReportsViewProps {
  invoices: Invoice[];
  payments: Payment[];
  clients: Client[];
  services: CreativeService[];
  business: BusinessProfile;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  payments,
  clients,
  services,
  business,
}) => {
  // Aggregate Metrics
  const totalBilled = invoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const totalCollected = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const totalOutstanding = invoices.reduce((s, i) => s + (i.balanceDue || 0), 0);

  // Aging Debt Buckets
  const now = Date.now();
  let agingCurrent = 0; // 0-30 days
  let aging30to60 = 0;
  let aging60plus = 0;

  invoices.forEach((inv) => {
    if (inv.balanceDue > 0) {
      const dueTime = new Date(inv.dueDate).getTime();
      const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        agingCurrent += inv.balanceDue;
      } else if (diffDays <= 30) {
        agingCurrent += inv.balanceDue;
      } else if (diffDays <= 60) {
        aging30to60 += inv.balanceDue;
      } else {
        aging60plus += inv.balanceDue;
      }
    }
  });

  const agingData = [
    { name: 'Current (<30d)', amount: agingCurrent, color: '#10b981' },
    { name: '31-60 Days', amount: aging30to60, color: '#f59e0b' },
    { name: 'Over 60 Days', amount: aging60plus, color: '#ef4444' },
  ];

  // Top Clients Ranking
  const topClients = clients
    .map((c) => {
      const clientInvs = invoices.filter((i) => i.clientId === c.id);
      const clientPays = payments.filter((p) => p.clientId === c.id);
      const billed = clientInvs.reduce((s, i) => s + (i.grandTotal || 0), 0);
      const paid = clientPays.reduce((s, p) => s + (p.amount || 0), 0);
      const bal = Math.max(0, billed - paid);
      return { client: c, billed, paid, bal, invCount: clientInvs.length };
    })
    .sort((a, b) => b.billed - a.billed)
    .slice(0, 5);

  // Tax collected
  let totalTaxCollected = 0;
  invoices.forEach((inv) => {
    if (inv.taxTotal && inv.taxTotal > 0) {
      // Pro-rated tax paid based on invoice payment proportion
      const ratio = inv.grandTotal > 0 ? (inv.amountPaid || 0) / inv.grandTotal : 0;
      totalTaxCollected += inv.taxTotal * ratio;
    }
  });

  const handleExportFullFinancialReportCSV = () => {
    let csv = 'Report: Creative Business Financial Statement\n';
    csv += `Business Name: ${business.name}\n`;
    csv += `Currency: ${business.currency}\n`;
    csv += `Generated Date: ${new Date().toISOString()}\n\n`;

    csv += 'INVOICES AUDIT TRAIL\n';
    csv += 'Invoice Number,Date,Due Date,Client,Status,Total,Amount Paid,Balance Due\n';
    invoices.forEach((inv) => {
      csv += `"${inv.invoiceNumber}","${inv.invoiceDate}","${inv.dueDate}","${inv.clientName}","${inv.status}",${inv.grandTotal},${inv.amountPaid},${inv.balanceDue}\n`;
    });

    csv += '\nPAYMENTS AUDIT TRAIL\n';
    csv += 'Receipt Number,Date,Client,Method,Transaction Ref,Amount\n';
    payments.forEach((p) => {
      csv += `"${p.receiptNumber || ''}","${p.paymentDate}","${p.clientName}","${p.paymentMethod}","${p.transactionReference || ''}",${p.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Financial_Report_${business.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Business Financial Reports & Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cashflow velocity, client balance aging, and tax liability audits
          </p>
        </div>
        <button
          onClick={handleExportFullFinancialReportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          Export Full Financial Audit CSV
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Billed Work
          </span>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalBilled, business.currency)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{invoices.length} invoices issued</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Realized Cash Collections
          </span>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalCollected, business.currency)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% recovery rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Outstanding Receivables
          </span>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalOutstanding, business.currency)}
          </p>
          <p className="text-[11px] text-rose-500 mt-1">Pending client clearance</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Tax / VAT Collected
          </span>
          <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {formatCurrency(totalTaxCollected, business.currency)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{business.defaultTaxRate || 15}% standard tax rate</p>
        </div>
      </div>

      {/* Debt Aging Analysis & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Debt Aging Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Receivables Aging Analysis
              </h3>
              <p className="text-xs text-slate-500">Uncollected balances sorted by days overdue</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {agingData.map((bucket) => {
              const pct = totalOutstanding > 0 ? (bucket.amount / totalOutstanding) * 100 : 0;
              return (
                <div key={bucket.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{bucket.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(bucket.amount, business.currency)} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: bucket.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl text-xs text-slate-600 dark:text-slate-400 mt-4">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Recommendation:</p>
            <p className="text-[11px] mt-0.5">
              Send polite WhatsApp payment reminders for invoices approaching 30 days due date.
            </p>
          </div>
        </div>

        {/* Top 5 High-Value Clients */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                Top Revenue Producing Clients
              </h3>
              <p className="text-xs text-slate-500">Ranked by total project billing value</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topClients.map((item, idx) => (
              <div key={item.client.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-slate-400 w-4">#{idx + 1}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.client.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.client.companyName || 'Individual'} &bull; {item.invCount} invoices
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 dark:text-white block">
                    {formatCurrency(item.billed, business.currency)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Paid: {formatCurrency(item.paid, business.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
