import React from 'react';
import { Invoice, Receipt, Client, Payment, BusinessProfile, CreativeService } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '../../utils/formatters';
import {
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Receipt as ReceiptIcon,
  Users,
  Plus,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Download,
  Eye,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardViewProps {
  invoices: Invoice[];
  receipts: Receipt[];
  clients: Client[];
  payments: Payment[];
  business: BusinessProfile;
  services: CreativeService[];
  onOpenCreateInvoice: () => void;
  onOpenCreateReceipt: () => void;
  onOpenCreateClient: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onViewReceipt: (receipt: Receipt) => void;
  onOpenPaymentModal: (invoice: Invoice) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  receipts,
  clients,
  payments,
  business,
  services,
  onOpenCreateInvoice,
  onOpenCreateReceipt,
  onOpenCreateClient,
  onViewInvoice,
  onViewReceipt,
  onOpenPaymentModal,
  onNavigateTab,
}) => {
  // Metrics Calculations
  const totalInvoicesCount = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const unpaidInvoices = invoices.filter((i) => i.status === 'unpaid');
  const partialInvoices = invoices.filter((i) => i.status === 'partially_paid');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  const totalRevenueBilled = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const totalRevenueCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOutstandingBalance = invoices.reduce((sum, i) => sum + (i.balanceDue || 0), 0);

  // Monthly Revenue Chart Data (Last 6 months)
  const monthlyData = [
    { month: 'Oct', billed: 12400, collected: 11000 },
    { month: 'Nov', billed: 16800, collected: 14500 },
    { month: 'Dec', billed: 28500, collected: 26000 },
    { month: 'Jan', billed: 19200, collected: 18000 },
    { month: 'Feb', billed: 22400, collected: 21500 },
    {
      month: 'Current',
      billed: Math.max(totalRevenueBilled, 8500),
      collected: Math.max(totalRevenueCollected, 5500),
    },
  ];

  // Category Breakdown Data
  const categoryData = [
    { name: 'Graphic Design', value: 35, color: '#6366f1' },
    { name: 'Printing & Large Format', value: 40, color: '#06b6d4' },
    { name: 'Branding & Identity', value: 15, color: '#ec4899' },
    { name: 'Signage & Fabrication', value: 10, color: '#f59e0b' },
  ];

  const recentInvoices = invoices.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Live Business Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {business.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Default Currency:{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">
              {business.currency}
            </span>{' '}
            &bull; Ready for instant invoicing, payments, and PDF receipts
          </p>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenCreateInvoice}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            + New Invoice
          </button>
          <button
            onClick={onOpenCreateReceipt}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ReceiptIcon className="h-4 w-4" />
            New Receipt
          </button>
          <button
            onClick={onOpenCreateClient}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Users className="h-4 w-4" />
            + Add Client
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Revenue Collected
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {formatCurrency(totalRevenueCollected, business.currency)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{payments.length} verified receipts & payments</span>
          </div>
        </div>

        {/* Outstanding Balance Due */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Outstanding Balance
            </span>
            <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(totalOutstandingBalance, business.currency)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
            <span>{unpaidInvoices.length + partialInvoices.length} invoices pending payment</span>
          </div>
        </div>

        {/* Total Invoices Valuation */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Invoiced Work
            </span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {formatCurrency(totalRevenueBilled, business.currency)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
            <span>{totalInvoicesCount} invoices issued</span>
          </div>
        </div>

        {/* Paid vs Pending Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Invoice Status Mix
            </span>
            <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-3 text-center">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200/50">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block">Paid</span>
              <span className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-300">{paidInvoices.length}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200/50">
              <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold block">Partial</span>
              <span className="text-xs font-black font-mono text-amber-700 dark:text-amber-300">{partialInvoices.length}</span>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-lg border border-rose-200/50">
              <span className="text-[10px] text-rose-800 dark:text-rose-400 font-bold block">Unpaid</span>
              <span className="text-xs font-black font-mono text-rose-700 dark:text-rose-300">{unpaidInvoices.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue & Cashflow Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue & Cash Inflow Performance
              </h3>
              <p className="text-xs text-slate-500">Invoiced Valuation vs Realized Payments</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-indigo-500" />
                <span className="text-slate-600 dark:text-slate-300">Invoiced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Collected</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0, business.currency), '']}
                />
                <Area
                  type="monotone"
                  dataKey="billed"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBilled)"
                  name="Invoiced"
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                  name="Collected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Creative Services Mix
            </h3>
            <p className="text-xs text-slate-500">Distribution by Project Demand</p>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryData.map((c) => (
              <div key={c.name} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices & Recent Receipts Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Invoices Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Invoices</h3>
              <p className="text-xs text-slate-500">Latest design & printing orders</p>
            </div>
            <button
              onClick={() => onNavigateTab('invoices')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 text-right">Total</th>
                  <th className="p-3.5 text-right">Balance</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentInvoices.map((inv) => {
                  const badge = getStatusBadgeInfo(inv.status);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{inv.clientName}</p>
                        {inv.clientCompanyName && (
                          <p className="text-[11px] text-slate-500">{inv.clientCompanyName}</p>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{formatDate(inv.dueDate)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(inv.grandTotal, inv.currency)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(inv.balanceDue, inv.currency)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View / Print / PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {inv.balanceDue > 0 && (
                            <button
                              onClick={() => onOpenPaymentModal(inv)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                              title="Record Payment"
                            >
                              <CreditCard className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payment Receipts Stream */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Receipts</h3>
              <p className="text-xs text-slate-500">Latest payment vouchers</p>
            </div>
            <button
              onClick={() => onNavigateTab('receipts')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[340px]">
            {receipts.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                onClick={() => onViewReceipt(rec)}
                className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {rec.receiptNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">&bull; {formatDate(rec.date)}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{rec.clientName}</p>
                  <p className="text-[11px] text-slate-500">{rec.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm block">
                    {formatCurrency(rec.amountPaid, rec.currency)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Bal: {formatCurrency(rec.balanceRemaining, rec.currency)}
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
