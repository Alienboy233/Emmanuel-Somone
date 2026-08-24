import React, { useState, useMemo } from 'react';
import { CreativeService, BusinessProfile, ServiceCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Sparkles,
  Plus,
  Search,
  Clock,
  Tag,
  Edit,
  Trash2,
  FileText,
  Star,
} from 'lucide-react';

interface ServicesViewProps {
  services: CreativeService[];
  business: BusinessProfile;
  onOpenCreateService: () => void;
  onEditService: (service: CreativeService) => void;
  onDeleteService: (serviceId: string) => void;
  onQuickCreateInvoiceWithService: (service: CreativeService) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  business,
  onOpenCreateService,
  onEditService,
  onDeleteService,
  onQuickCreateInvoiceWithService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (categoryFilter !== 'All' && srv.category !== categoryFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = srv.name.toLowerCase().includes(q);
        const matchDesc = (srv.description || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [services, categoryFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Creative Services & Rate Card Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standardize your design, printing, signage, and branding rates for instant invoice line items
          </p>
        </div>
        <button
          onClick={onOpenCreateService}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          + Add Service Preset
        </button>
      </div>

      {/* Filter and Categories */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search service presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all group"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {srv.category}
                  </span>
                  {srv.popular && (
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditService(srv)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteService(srv.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {srv.name}
              </h3>
              {srv.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {srv.description}
                </p>
              )}

              {srv.turnaroundTime && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>Turnaround: {srv.turnaroundTime}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rate</span>
                <span className="text-lg font-black font-mono text-purple-700 dark:text-purple-400">
                  {formatCurrency(srv.defaultPrice, business.currency)}
                </span>
                <span className="text-[10px] text-slate-400 font-normal"> / {srv.defaultUnit || 'job'}</span>
              </div>

              <button
                onClick={() => onQuickCreateInvoiceWithService(srv)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Use in Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
