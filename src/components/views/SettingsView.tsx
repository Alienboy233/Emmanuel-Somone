import React, { useState } from 'react';
import { BusinessProfile, TemplateStyle, CurrencyCode, PaymentMethodType } from '../../types';
import { db } from '../../services/db';
import {
  Building2,
  CreditCard,
  Palette,
  DollarSign,
  Database,
  Save,
  CheckCircle2,
  Upload,
  RotateCcw,
  Download,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (updated: BusinessProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ business, onUpdateBusiness }) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...business });
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'templates' | 'data'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof BusinessProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoMoChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      mobileMoneyDetails: {
        ...prev.mobileMoneyDetails,
        [field]: value,
      },
    }));
  };

  const handleBankChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.setBusinessProfile(formData);
    onUpdateBusiness(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportBackup = () => {
    const data = db.exportAllDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InvoiceHub_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = db.importAllDataJSON(json);
        if (success) {
          alert('Backup data successfully imported! Refreshing state...');
          window.location.reload();
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset application data to standard creative studio sample records?')) {
      db.resetToDefaultData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Business Settings & Customization
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure your brand identity, payment channels (Mobile Money / Bank), and invoice templates
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Settings Saved Successfully!
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'profile', label: 'Business Profile', icon: Building2 },
          { id: 'payments', label: 'Mobile Money & Bank Details', icon: CreditCard },
          { id: 'templates', label: 'Invoice Design & Defaults', icon: Palette },
          { id: 'data', label: 'Backup & Demo Data', icon: Database },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Business Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              General Business & Brand Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Business / Studio Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tagline / Business Slogan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design &bull; Large Format Printing &bull; Branding"
                  value={formData.tagline || ''}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Business Logo Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logo || ''}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your logo automatically renders with crisp sizing across all PDF invoices and payment receipts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Website / Social Handle
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Physical Studio / Workshop Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  TIN / Tax Identification Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. C000382910X"
                  value={formData.taxNumber || ''}
                  onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile Money & Bank Details */}
        {activeTab === 'payments' && (
          <div className="space-y-6 text-xs">
            {/* Mobile Money Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Mobile Money Payment Details (Ghana MoMo / Telecel)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Primary MoMo Provider
                  </label>
                  <select
                    value={formData.mobileMoneyDetails.primaryProvider}
                    onChange={(e) => handleMoMoChange('primaryProvider', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                    <option value="AirtelTigo Money">AirtelTigo Money</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    MoMo Registered Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.mobileMoneyDetails.accounts?.[0]?.accountName || ''}
                    onChange={(e) => {
                      const accs = [...(formData.mobileMoneyDetails.accounts || [])];
                      if (!accs[0]) accs[0] = { provider: 'MTN Mobile Money', accountNumber: '', accountName: '' };
                      accs[0].accountName = e.target.value;
                      handleMoMoChange('accounts', accs);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    MoMo Number / Merchant ID
                  </label>
                  <input
                    type="text"
                    value={formData.mobileMoneyDetails.accounts?.[0]?.accountNumber || ''}
                    onChange={(e) => {
                      const accs = [...(formData.mobileMoneyDetails.accounts || [])];
                      if (!accs[0]) accs[0] = { provider: 'MTN Mobile Money', accountNumber: '', accountName: '' };
                      accs[0].accountNumber = e.target.value;
                      handleMoMoChange('accounts', accs);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  MoMo Payment Instructions Note
                </label>
                <input
                  type="text"
                  value={formData.mobileMoneyDetails.instructions || ''}
                  onChange={(e) => handleMoMoChange('instructions', e.target.value)}
                  placeholder="e.g. Use Invoice # as reference when sending MoMo"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Bank Wire Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" />
                Direct Bank Wire Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleBankChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Bank Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountName}
                    onChange={(e) => handleBankChange('accountName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.branch || ''}
                    onChange={(e) => handleBankChange('branch', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Swift / Sort Code
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.swiftCode || ''}
                    onChange={(e) => handleBankChange('swiftCode', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Template & Design Defaults */}
        {activeTab === 'templates' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-600" />
              Invoice & Receipt Layout Customization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Default Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                >
                  <option value="GHS">Ghana Cedi (GH₵)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="NGN">Nigerian Naira (₦)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Default Invoice Template
                </label>
                <select
                  value={formData.defaultTemplate}
                  onChange={(e) => handleInputChange('defaultTemplate', e.target.value as TemplateStyle)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
                >
                  <option value="modern">Modern Professional</option>
                  <option value="creative">Creative Studio (Gradient)</option>
                  <option value="printing-hub">Printing & Signage Hub</option>
                  <option value="corporate">Executive Corporate</option>
                  <option value="minimal">Minimalist Clean</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Default Tax / VAT Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.defaultTaxRate}
                  onChange={(e) => handleInputChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Default Terms & Payment Conditions
              </label>
              <textarea
                rows={2}
                value={formData.defaultInvoiceTerms}
                onChange={(e) => handleInputChange('defaultInvoiceTerms', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Default Invoice Customer Notes
              </label>
              <textarea
                rows={2}
                value={formData.defaultInvoiceNotes}
                onChange={(e) => handleInputChange('defaultInvoiceNotes', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Custom Invoice Footer
              </label>
              <input
                type="text"
                value={formData.customFooterText || ''}
                onChange={(e) => handleInputChange('customFooterText', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Backup & Demo Data */}
        {activeTab === 'data' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-600" />
              Database Backup, Recovery & Demo Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Download Full JSON Backup</span>
                <p className="text-[11px] text-slate-500">
                  Export all your clients, invoices, payments, and custom templates into a portable file.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Download Backup (.json)
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Restore from Backup File</span>
                <p className="text-[11px] text-slate-500">
                  Upload a previously exported .json file to restore your entire database.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold">
                  <Upload className="h-4 w-4" />
                  Select Backup File
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center bg-rose-50/60 dark:bg-rose-950/30 p-4 rounded-xl border border-rose-200 dark:border-rose-900">
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300 block">Reset to Demo Creative Business Data</span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400">
                    Loads AfroPixel Creative & Print Hub showcase data with clients, invoices, receipts, and templates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSampleData}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            Save Business Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
