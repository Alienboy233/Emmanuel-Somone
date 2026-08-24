import React, { useState, useMemo } from 'react';
import { Invoice, BusinessProfile, InvoiceStatus } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeInfo, generateWhatsAppMessage } from '../../utils/formatters';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  CreditCard,
  Download,
  Copy,
  Trash2,
  Edit,
  ArrowUpDown,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface InvoicesViewProps {
  invoices: Invoice[];
  business: BusinessProfile;
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onOpenPaymentModal: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  business,
  onOpenCreateInvoice,
  onViewInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onOpenPaymentModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'balance-desc'>('date-desc');

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(query);
        const matchClient = inv.clientName.toLowerCase().includes(query);
        const matchCompany = (inv.clientCompanyName || '').toLowerCase().includes(query);
        const matchItems = inv.items.some((it) => it.description.toLowerCase().includes(query));
        if (!matchNumber && !matchClient && !matchCompany && !matchItems) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
      }
      if (sortBy === 'amount-desc') {
        return (b.grandTotal || 0) - (a.grandTotal || 0);
      }
      if (sortBy === 'balance-desc') {
        return (b.balanceDue || 0) - (a.balanceDue || 0);
      }
      return 0;
    });
  }, [invoices, statusFilter, searchTerm, sortBy]);

  // Quick stats
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + (i.amountPaid || 0), 0);
  const totalBalance = invoices.reduce((sum, i) => sum + (i.balanceDue || 0), 0);

  const filterTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Invoices', count: invoices.length },
    { id: 'unpaid', label: 'Unpaid', count: invoices.filter((i) => i.status === 'unpaid').length },
    { id: 'partially_paid', label: 'Partially Paid', count: invoices.filter((i) => i.status === 'partially_paid').length },
    { id: 'paid', label: 'Paid in Full', count: invoices.filter((i) => i.status === 'paid').length },
    { id: 'overdue', label: 'Overdue', count: invoices.filter((i) => i.status === 'overdue').length },
  ];

  const handleWhatsApp = (invoice: Invoice) => {
    const primaryMomo = business.mobileMoneyDetails.accounts?.[0];
    const text = generateWhatsAppMessage(
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
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Invoices Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, track, send, and collect payment for creative project invoices
          </p>
        </div>
        <button
          onClick={onOpenCreateInvoice}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          + Create New Invoice
        </button>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Invoiced
          </span>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalInvoiced, business.currency)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Total Collected
          </span>
          <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalPaid, business.currency)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Total Balance Outstanding
          </span>
          <p className="text-xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalBalance, business.currency)}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client, invoice #, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="balance-desc">Highest Balance Due</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Client & Company</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 text-right">Total</th>
                <th className="p-3.5 text-right">Paid</th>
                <th className="p-3.5 text-right">Balance Due</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
                const badge = getStatusBadgeInfo(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="hover:underline font-bold text-left"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{inv.clientName}</p>
                      {inv.clientCompanyName && (
                        <p className="text-[11px] text-slate-500">{inv.clientCompanyName}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{formatDate(inv.invoiceDate)}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{formatDate(inv.dueDate)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(inv.grandTotal, inv.currency)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(inv.amountPaid, inv.currency)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                      {formatCurrency(inv.balanceDue, inv.currency)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
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
                        <button
                          onClick={() => handleWhatsApp(inv)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                          title="WhatsApp Invoice Summary"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDuplicateInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Duplicate Invoice"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <FileText className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No invoices matched your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing filters or generate a new invoice</p>
                    <button
                      onClick={onOpenCreateInvoice}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow"
                    >
                      + Create Invoice
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
