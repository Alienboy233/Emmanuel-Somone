import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BusinessProfile, Invoice } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  CreditCard,
  Sparkles,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Plus,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
  Building2,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

interface AppLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  business: BusinessProfile;
  invoices: Invoice[];
  onOpenCreateInvoice: () => void;
  onOpenAuthModal: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  business,
  invoices,
  onOpenCreateInvoice,
  onOpenAuthModal,
  children,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unpaidCount = invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: unpaidCount > 0 ? unpaidCount : undefined },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'services', label: 'Services Catalog', icon: Sparkles },
    { id: 'reports', label: 'Reports & Tax', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="h-9 w-auto object-contain rounded-lg shadow-xs group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-600/30">
                {business.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {business.name}
              </span>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 hidden sm:block">
                Creative Studio Invoicing & Receipts Hub
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Action, Currency Badge, Theme Toggle & User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Currency Pill */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase">CURRENCY:</span>
            <span>{business.currency}</span>
          </div>

          {/* New Invoice Button */}
          <button
            onClick={onOpenCreateInvoice}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Invoice</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-[9px] font-bold uppercase">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSelectTab('settings');
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Settings className="h-3.5 w-3.5 text-slate-400" />
                      Studio Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body Structure with Sidebar + Main Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-60 shrink-0 space-y-2 sticky top-20 self-start">
          <nav className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Business Card Snapshot */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                PAYMENT CHANNELS
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="font-bold text-slate-100 truncate">
              {business.mobileMoneyDetails.primaryProvider}
            </p>
            <p className="text-[11px] text-indigo-200 font-mono">
              {business.mobileMoneyDetails.accounts?.[0]?.accountNumber || business.phone}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              Name: {business.mobileMoneyDetails.accounts?.[0]?.accountName || business.name}
            </p>
          </div>
        </aside>

        {/* Mobile Slideout Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden flex">
            <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-sm text-slate-900 dark:text-white">Navigation</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs font-bold">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-rose-500 text-white font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                <p className="font-bold text-slate-600 dark:text-slate-300">{business.name}</p>
                <p className="text-[11px] mt-0.5">Version 2.4.0</p>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
