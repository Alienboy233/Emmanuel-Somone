export type CurrencyCode = 'GHS' | 'USD' | 'GBP' | 'EUR' | 'NGN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateToGHS?: number;
}

export type InvoiceStatus = 
  | 'draft' 
  | 'sent' 
  | 'unpaid' 
  | 'partially_paid' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled';

export type PaymentMethodType = 
  | 'MTN Mobile Money' 
  | 'Telecel Cash' 
  | 'AirtelTigo Money' 
  | 'Bank Transfer' 
  | 'Cash' 
  | 'Card' 
  | 'Other';

export type TemplateStyle = 
  | 'minimal' 
  | 'modern' 
  | 'creative' 
  | 'corporate' 
  | 'printing-hub';

export type ServiceCategory = 
  | 'Graphic Design' 
  | 'Printing' 
  | 'Branding' 
  | 'Signage & Large Format' 
  | 'Photography & Video' 
  | 'Digital Marketing' 
  | 'Packaging' 
  | 'Custom';

export interface MobileMoneyAccount {
  provider: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Other';
  accountName: string;
  accountNumber: string;
  merchantId?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  sortCode?: string;
  swiftCode?: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  tagline?: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  socialHandle?: string;
  taxNumber?: string; // TIN or VAT Number
  currency: CurrencyCode;
  defaultPaymentTerms: string;
  bankDetails: BankAccountDetails;
  mobileMoneyDetails: {
    primaryProvider: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Other';
    accounts: MobileMoneyAccount[];
    instructions?: string;
  };
  defaultTaxRate: number;
  defaultTaxLabel: string;
  defaultInvoiceNotes: string;
  defaultInvoiceTerms: string;
  invoicePrefix: string;
  receiptPrefix: string;
  invoiceSequence: number;
  receiptSequence: number;
  defaultTemplate: TemplateStyle;
  themeColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoPosition: 'left' | 'center' | 'right' | 'top-banner';
  customFooterText: string;
  watermarksEnabled: boolean;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  preferredCurrency?: CurrencyCode;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category?: ServiceCategory | string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage or fixed
  discountType: 'percentage' | 'fixed';
  taxRate: number; // percentage
  total: number;
  specifications?: string; // e.g. "300gsm Matte, Spot UV, Size A3"
}

export interface Invoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  
  // Client Snapshot & ID
  clientId: string;
  clientName: string;
  clientCompanyName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;

  // Line items
  items: InvoiceItem[];

  // Totals
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;

  // Currency
  currency: CurrencyCode;
  currencySymbol: string;

  // Payment info & Instructions
  paymentMethodPreference?: PaymentMethodType | string;
  paymentInstructions?: string;
  notes?: string;
  terms?: string;

  // Template Overrides
  template: TemplateStyle;
  themeColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoPosition?: 'left' | 'center' | 'right' | 'top-banner';
  footerText?: string;

  // Timestamps
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  businessId: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  receiptId?: string;
  receiptNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethodType;
  transactionReference?: string; // MoMo Tx ID or Bank ref
  notes?: string;
  currency: CurrencyCode;
  currencySymbol: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  businessId: string;
  receiptNumber: string;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentId?: string;
  
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;

  date: string;
  paymentMethod: PaymentMethodType | string;
  transactionReference?: string;
  description: string;
  
  amountPaid: number;
  totalAmount: number;
  balanceRemaining: number;
  paymentStatus: 'Fully Paid' | 'Deposit / Partial Payment' | 'Final Balance Paid';
  
  notes?: string;
  currency: CurrencyCode;
  currencySymbol: string;
  template: TemplateStyle;
  themeColor?: string;
  
  createdAt: string;
}

export interface CreativeService {
  id: string;
  businessId: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  defaultUnit: string; // e.g. "unit", "100pcs", "m²", "hour", "project"
  description?: string;
  turnaroundTime?: string;
  popular?: boolean;
}

export type UserRole = 'owner' | 'manager' | 'designer' | 'accountant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId: string;
  avatar?: string;
  createdAt: string;
}

export interface ClientStatement {
  client: Client;
  invoices: Invoice[];
  payments: Payment[];
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  statementDate: string;
}

export type DateFilterOption = 
  | 'today' 
  | 'this_week' 
  | 'this_month' 
  | 'this_year' 
  | 'all_time' 
  | 'custom';
