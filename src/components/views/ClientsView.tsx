import React, { useState, useMemo } from 'react';
import { Client, Invoice, Payment, BusinessProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  FileText,
  FileSpreadsheet,
  Edit,
  Trash2,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  business: BusinessProfile;
  onOpenCreateClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenStatement: (client: Client) => void;
  onCreateInvoiceForClient: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  invoices,
  payments,
  business,
  onOpenCreateClient,
  onEditClient,
  onDeleteClient,
  onOpenStatement,
  onCreateInvoiceForClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate client metrics dynamically
  const clientsWithMetrics = useMemo(() => {
    return clients.map((client) => {
      const clientInvoices = invoices.filter((i) => i.clientId === client.id);
      const clientPayments = payments.filter((p) => p.clientId === client.id);

      const totalBilled = clientInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
      const totalPaid = clientPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const balanceDue = Math.max(0, totalBilled - totalPaid);

      return {
        ...client,
        totalBilled,
        totalPaid,
        balanceDue,
        invoiceCount: clientInvoices.length,
      };
    });
  }, [clients, invoices, payments]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clientsWithMetrics;
    const q = searchTerm.toLowerCase();
    return clientsWithMetrics.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.companyName || '').toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [clientsWithMetrics, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Client & Brand Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage corporate partners, track customer balances, and generate account statements
          </p>
        </div>
        <button
          onClick={onOpenCreateClient}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          + Add New Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, company, phone or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {client.name}
                  </h3>
                  {client.companyName ? (
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      {client.companyName}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">Individual Client</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditClient(client)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit client"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                    title="Delete client"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="my-3 space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {client.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Metrics Strip */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Total Invoiced</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(client.totalBilled, business.currency)}
                  </span>
                </div>
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Paid</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(client.totalPaid, business.currency)}
                  </span>
                </div>
                <div className="bg-rose-50/70 dark:bg-rose-950/30 p-2 rounded-lg">
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block">Balance</span>
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                    {formatCurrency(client.balanceDue, business.currency)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenStatement(client)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
                  Statement
                </button>
                <button
                  onClick={() => onCreateInvoiceForClient(client.id)}
                  className="flex-1 py-1.5 px-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
