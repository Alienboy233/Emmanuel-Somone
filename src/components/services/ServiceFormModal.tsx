import React, { useState, useEffect } from 'react';
import { CreativeService, ServiceCategory, BusinessProfile } from '../../types';
import { db } from '../../services/db';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: CreativeService | null;
  business: BusinessProfile;
  onSaved: (service: CreativeService) => void;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
  business,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Graphic Design');
  const [defaultPrice, setDefaultPrice] = useState<string>('500');
  const [defaultUnit, setDefaultUnit] = useState<string>('unit');
  const [description, setDescription] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('24-48 hours');
  const [popular, setPopular] = useState(false);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setDefaultPrice(serviceToEdit.defaultPrice.toString());
      setDefaultUnit(serviceToEdit.defaultUnit || 'unit');
      setDescription(serviceToEdit.description || '');
      setTurnaroundTime(serviceToEdit.turnaroundTime || '24-48 hours');
      setPopular(serviceToEdit.popular || false);
    } else {
      setName('');
      setCategory('Graphic Design');
      setDefaultPrice('250');
      setDefaultUnit('design');
      setDescription('');
      setTurnaroundTime('24-48 hours');
      setPopular(false);
    }
  }, [serviceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved = db.saveService({
      id: serviceToEdit?.id,
      name: name.trim(),
      category,
      defaultPrice: parseFloat(defaultPrice) || 0,
      defaultUnit: defaultUnit.trim() || 'unit',
      description: description.trim() || undefined,
      turnaroundTime: turnaroundTime.trim() || undefined,
      popular,
    });

    onSaved(saved);
    onClose();
  };

  const categories: ServiceCategory[] = [
    'Graphic Design',
    'Printing',
    'Branding',
    'Signage & Large Format',
    'Photography & Video',
    'Digital Marketing',
    'Packaging',
    'Custom',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              {serviceToEdit ? 'Edit Service Offering' : 'Add Creative Service Preset'}
            </h2>
            <p className="text-xs text-slate-500">Save rates for quick 1-click invoice itemization</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Service / Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. A3 Flyer Printing / 3D Storefront Sign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Standard Rate ({CURRENCY_SYMBOLS[business.currency] || 'GH₵'}) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Billing Unit
              </label>
              <input
                type="text"
                placeholder="e.g. unit, pack of 100, sq.m, hr"
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Estimated Turnaround
              </label>
              <input
                type="text"
                placeholder="e.g. 24-48 hours, 3 days"
                value={turnaroundTime}
                onChange={(e) => setTurnaroundTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Description / Job Specifications Template
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 300gsm Art Card, Velvet Matte Lamination, CMYK Bleed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="popular-service"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
            <label htmlFor="popular-service" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pin as Featured / Frequently Ordered Service
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              {serviceToEdit ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
