import React, { useState, useEffect } from 'react';
import {
  Invoice,
  InvoiceItem,
  Client,
  BusinessProfile,
  TemplateStyle,
  CurrencyCode,
  PaymentMethodType,
  CreativeService,
} from '../../types';
import { db } from '../../services/db';
import { formatCurrency, CURRENCY_SYMBOLS } from '../../utils/formatters';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  UserPlus,
  Calendar,
  DollarSign,
  FileText,
  Palette,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice | null;
  onSaved: (savedInvoice: Invoice) => void;
  clients: Client[];
  business: BusinessProfile;
  services: CreativeService[];
  initialClientId?: string;
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  onClose,
  invoiceToEdit,
  onSaved,
  clients,
  business,
  services,
  initialClientId,
}) => {
  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>(business.currency || 'GHS');
  const [paymentMethodPreference, setPaymentMethodPreference] = useState<PaymentMethodType>(
    (business.mobileMoneyDetails.primaryProvider as PaymentMethodType) || 'MTN Mobile Money'
  );
  const [paymentInstructions, setPaymentInstructions] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [terms, setTerms] = useState<string>('');
  const [template, setTemplate] = useState<TemplateStyle>(business.defaultTemplate || 'modern');
  const [themeColor, setThemeColor] = useState<string>(business.themeColor || '#4f46e5');

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Inline New Client Form
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // Service Preset Drawer
  const [showServicePresets, setShowServicePresets] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  useEffect(() => {
    if (invoiceToEdit) {
      setInvoiceNumber(invoiceToEdit.invoiceNumber);
      setInvoiceDate(invoiceToEdit.invoiceDate);
      setDueDate(invoiceToEdit.dueDate);
      setClientId(invoiceToEdit.clientId);
      setCurrency(invoiceToEdit.currency);
      setPaymentMethodPreference((invoiceToEdit.paymentMethodPreference as PaymentMethodType) || 'MTN Mobile Money');
      setPaymentInstructions(invoiceToEdit.paymentInstructions || business.mobileMoneyDetails.instructions || '');
      setNotes(invoiceToEdit.notes || business.defaultInvoiceNotes);
      setTerms(invoiceToEdit.terms || business.defaultInvoiceTerms);
      setTemplate(invoiceToEdit.template || business.defaultTemplate);
      setThemeColor(invoiceToEdit.themeColor || business.themeColor);
      setItems(invoiceToEdit.items.map((it) => ({ ...it })));
    } else {
      // New Invoice Initialization
      const nextNum = db.getNextInvoiceNumber();
      setInvoiceNumber(nextNum);
      const today = new Date().toISOString().split('T')[0];
      setInvoiceDate(today);
      const due = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      setDueDate(due);
      setClientId(initialClientId || (clients.length > 0 ? clients[0].id : ''));
      setCurrency(business.currency || 'GHS');
      setPaymentMethodPreference((business.mobileMoneyDetails.primaryProvider as PaymentMethodType) || 'MTN Mobile Money');
      setPaymentInstructions(business.mobileMoneyDetails.instructions || '');
      setNotes(business.defaultInvoiceNotes);
      setTerms(business.defaultInvoiceTerms);
      setTemplate(business.defaultTemplate || 'modern');
      setThemeColor(business.themeColor || '#4f46e5');

      // Default sample line item
      setItems([
        {
          id: `item_${Date.now()}`,
          description: 'Brand Identity & Logo Suite',
          category: 'Graphic Design',
          quantity: 1,
          unitPrice: 1500,
          discount: 0,
          discountType: 'percentage',
          taxRate: business.defaultTaxRate || 15,
          total: 1500,
          specifications: 'Primary & secondary vector logos, typography & color guidelines',
        },
      ]);
    }
  }, [invoiceToEdit, isOpen, business, initialClientId]);

  // Calculations
  const calculateTotals = () => {
    let sub = 0;
    let disc = 0;
    let tax = 0;

    items.forEach((item) => {
      const lineSub = (item.quantity || 0) * (item.unitPrice || 0);
      let lineDisc = 0;
      if (item.discountType === 'percentage') {
        lineDisc = (lineSub * (item.discount || 0)) / 100;
      } else {
        lineDisc = item.discount || 0;
      }
      const lineAfterDisc = Math.max(0, lineSub - lineDisc);
      const lineTax = (lineAfterDisc * (item.taxRate || 0)) / 100;

      sub += lineSub;
      disc += lineDisc;
      tax += lineTax;
    });

    const grand = Math.max(0, sub - disc + tax);
    return { subtotal: sub, discountTotal: disc, taxTotal: tax, grandTotal: grand };
  };

  const totals = calculateTotals();

  // Handlers for Items
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const targetItem = { ...updated[index], [field]: value };

    // Recompute line item total
    const qty = targetItem.quantity || 0;
    const price = targetItem.unitPrice || 0;
    const sub = qty * price;
    let disc = 0;
    if (targetItem.discountType === 'percentage') {
      disc = (sub * (targetItem.discount || 0)) / 100;
    } else {
      disc = targetItem.discount || 0;
    }
    targetItem.total = Math.max(0, sub - disc);

    updated[index] = targetItem;
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percentage',
      taxRate: business.defaultTaxRate || 15,
      total: 0,
      specifications: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      // Clear single item rather than leave 0 items
      setItems([
        {
          id: `item_${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          discountType: 'percentage',
          taxRate: business.defaultTaxRate || 15,
          total: 0,
        },
      ]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSelectServicePreset = (service: CreativeService) => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      description: service.name,
      category: service.category,
      quantity: 1,
      unitPrice: service.defaultPrice,
      discount: 0,
      discountType: 'percentage',
      taxRate: business.defaultTaxRate || 15,
      total: service.defaultPrice,
      specifications: service.description || `${service.defaultUnit} - standard turnaround`,
    };

    // If only one item and it's empty, replace it
    if (items.length === 1 && !items[0].description) {
      setItems([newItem]);
    } else {
      setItems([...items, newItem]);
    }
    setShowServicePresets(false);
  };

  const handleCreateQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    const saved = db.saveClient({
      name: newClientName,
      companyName: newClientCompany,
      phone: newClientPhone,
      email: newClientEmail,
    });

    setClientId(saved.id);
    setShowNewClientForm(false);
    setNewClientName('');
    setNewClientCompany('');
    setNewClientPhone('');
    setNewClientEmail('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId) {
      alert('Please select or add a client.');
      return;
    }

    if (items.length === 0 || !items.some((i) => i.description.trim() !== '')) {
      alert('Please add at least one line item with a description.');
      return;
    }

    const client = clients.find((c) => c.id === clientId);

    const invoicePayload: Partial<Invoice> & { clientId: string; items: InvoiceItem[] } = {
      id: invoiceToEdit?.id,
      invoiceNumber: invoiceNumber.trim() || db.getNextInvoiceNumber(),
      invoiceDate,
      dueDate,
      clientId,
      clientName: client?.name || 'Valued Client',
      clientCompanyName: client?.companyName,
      clientPhone: client?.phone,
      clientEmail: client?.email,
      clientAddress: client?.address,
      items: items.filter((i) => i.description.trim() !== ''),
      currency,
      currencySymbol: CURRENCY_SYMBOLS[currency] || 'GH₵',
      paymentMethodPreference,
      paymentInstructions,
      notes,
      terms,
      template,
      themeColor,
      status: invoiceToEdit ? invoiceToEdit.status : 'unpaid',
      amountPaid: invoiceToEdit ? invoiceToEdit.amountPaid : 0,
    };

    const saved = db.saveInvoice(invoicePayload);
    onSaved(saved);
    onClose();
  };

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices =
    selectedCategoryFilter === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategoryFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              {invoiceToEdit ? `Edit Invoice (${invoiceToEdit.invoiceNumber})` : 'Create New Creative Invoice'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate itemized design, printing, and signage invoices in seconds
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {/* Top Section: Number, Dates, Client, Currency */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Invoice Number */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Invoice Date */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Due Date */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Currency */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="GHS">Ghana Cedi (GH₵)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="EUR">Euro (€)</option>
                <option value="NGN">Nigerian Naira (₦)</option>
              </select>
            </div>
          </div>

          {/* Client Selection Row */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Client / Business Partner
              </label>
              <button
                type="button"
                onClick={() => setShowNewClientForm(!showNewClientForm)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {showNewClientForm ? 'Cancel New Client' : '+ Add New Client'}
              </button>
            </div>

            {!showNewClientForm ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-8">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Choose an existing client --
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.phone}
                      </option>
                    ))}
                  </select>
                </div>
                {clientId && (
                  <div className="md:col-span-4 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {(() => {
                      const sel = clients.find((c) => c.id === clientId);
                      return sel ? (
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{sel.name}</p>
                          <p className="text-[11px]">{sel.phone} &bull; {sel.email}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            ) : (
              /* Inline Quick Add Client */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kwame Mensah"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Accra Media Lab"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Phone / MoMo Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +233 24 000 0000"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@domain.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateQuickClient}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold whitespace-nowrap"
                  >
                    Save & Select
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Line Items Table & Creative Presets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Services & Products Itemization</span>
                <span className="text-slate-400 font-normal">({items.length} items)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowServicePresets(!showServicePresets)}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  + Insert Creative Preset Service
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Custom Item
                </button>
              </div>
            </div>

            {/* Presets Quick Drawer */}
            {showServicePresets && (
              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Creative & Print Services Catalog (1-Click Add):
                  </span>
                  <div className="flex gap-1 overflow-x-auto text-[11px]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          selectedCategoryFilter === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => handleSelectServicePreset(srv)}
                      className="cursor-pointer bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900 hover:border-purple-400 hover:shadow-xs transition-all text-xs group"
                    >
                      <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600">
                        <span className="truncate mr-2">{srv.name}</span>
                        <span className="font-mono whitespace-nowrap text-purple-700 dark:text-purple-400">
                          {formatCurrency(srv.defaultPrice, currency)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {srv.description || srv.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Description & Specifications</th>
                    <th className="p-3 w-20 text-center">Qty</th>
                    <th className="p-3 w-28 text-right">Price ({CURRENCY_SYMBOLS[currency]})</th>
                    <th className="p-3 w-24 text-right">Disc (%)</th>
                    <th className="p-3 w-24 text-right">Tax (%)</th>
                    <th className="p-3 w-28 text-right">Total</th>
                    <th className="p-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5">
                        <input
                          type="text"
                          placeholder="e.g. Logo Design / Flyer Printing"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-semibold text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none mb-1"
                        />
                        <input
                          type="text"
                          placeholder="Print Specs / Notes (e.g. 300gsm Gloss, Spot UV, A3 Size)"
                          value={item.specifications || ''}
                          onChange={(e) => handleItemChange(idx, 'specifications', e.target.value)}
                          className="w-full px-2 py-1 bg-transparent border border-dashed border-slate-200 dark:border-slate-700 rounded text-[11px] text-slate-500 dark:text-slate-400 focus:outline-none"
                        />
                      </td>
                      <td className="p-2.5 align-top">
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center font-bold text-slate-900 dark:text-slate-100 text-xs"
                        />
                      </td>
                      <td className="p-2.5 align-top">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-right font-mono text-slate-900 dark:text-slate-100 text-xs"
                        />
                      </td>
                      <td className="p-2.5 align-top">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-right font-mono text-slate-900 dark:text-slate-100 text-xs"
                        />
                      </td>
                      <td className="p-2.5 align-top">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-right font-mono text-slate-900 dark:text-slate-100 text-xs"
                        />
                      </td>
                      <td className="p-2.5 align-top text-right font-mono font-bold text-slate-900 dark:text-white pt-3.5">
                        {formatCurrency(item.total, currency)}
                      </td>
                      <td className="p-2.5 align-top text-center pt-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Details & Financial Totals Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left: Payment Method & Terms */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Payment Channels & Instructions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Preferred Channel</label>
                    <select
                      value={paymentMethodPreference}
                      onChange={(e) => setPaymentMethodPreference(e.target.value as PaymentMethodType)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Telecel Cash">Telecel Cash</option>
                      <option value="AirtelTigo Money">AirtelTigo Money</option>
                      <option value="Bank Transfer">Bank Transfer (Direct Wire)</option>
                      <option value="Cash">Cash on Delivery / Pickup</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="Other">Other Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Deposit/Payment Terms</label>
                    <input
                      type="text"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="e.g. 50% Deposit, Balance on delivery"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Payment Instructions / MoMo Account Info
                  </label>
                  <textarea
                    rows={2}
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    placeholder="Enter phone numbers, accounts or remittance guidance..."
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Customer Notes & Artwork Approval
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for your client..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Right: Totals Summary & Template Styling */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-2.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold">{formatCurrency(totals.subtotal, currency)}</span>
                </div>
                {totals.discountTotal > 0 && (
                  <div className="flex justify-between text-xs text-rose-400">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-{formatCurrency(totals.discountTotal, currency)}</span>
                  </div>
                )}
                {totals.taxTotal > 0 && (
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{business.defaultTaxLabel || 'Tax (VAT/Levy)'}</span>
                    <span className="font-mono font-bold">+{formatCurrency(totals.taxTotal, currency)}</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-200">Grand Total</span>
                  <span className="text-xl font-black font-mono text-white">
                    {formatCurrency(totals.grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Template Style Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-indigo-600" />
                    Invoice Template
                  </label>
                  {/* Theme Color Picker */}
                  <div className="flex items-center gap-1.5">
                    {['#4f46e5', '#059669', '#d946ef', '#0f172a', '#ea580c'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setThemeColor(color)}
                        className={`h-5 w-5 rounded-full border-2 transition-transform ${
                          themeColor === color ? 'scale-125 border-white shadow-sm' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px] font-bold">
                  {(
                    [
                      { id: 'modern', label: 'Modern' },
                      { id: 'creative', label: 'Creative' },
                      { id: 'printing-hub', label: 'Print Hub' },
                      { id: 'corporate', label: 'Corporate' },
                      { id: 'minimal', label: 'Minimal' },
                    ] as const
                  ).map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        template === tpl.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              {invoiceToEdit ? 'Save Changes' : 'Create & Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
