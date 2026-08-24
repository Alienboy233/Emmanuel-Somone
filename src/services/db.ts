import {
  BusinessProfile,
  Client,
  Invoice,
  InvoiceItem,
  Payment,
  Receipt,
  CreativeService,
  User,
  CurrencyCode,
  TemplateStyle,
} from '../types';

const STORAGE_KEYS = {
  USER: 'cs_user',
  BUSINESS: 'cs_business',
  CLIENTS: 'cs_clients',
  INVOICES: 'cs_invoices',
  RECEIPTS: 'cs_receipts',
  PAYMENTS: 'cs_payments',
  SERVICES: 'cs_services',
  THEME: 'cs_theme_mode',
};

// Default Sample Business Profile (Ghanaian Creative Studio & Print Hub)
export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz_001',
  userId: 'user_001',
  name: 'AfroPixel Creative & Print Hub',
  tagline: 'High-Impact Branding, Graphic Design & Precision Printing',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  address: 'Plot 42 Ring Road Central, Osu, Accra, Ghana',
  phone: '+233 24 890 1234',
  email: 'hello@afropixelcreatives.com',
  website: 'www.afropixelcreatives.com',
  socialHandle: '@afropixel_gh',
  taxNumber: 'TIN-P002394812X',
  currency: 'GHS',
  defaultPaymentTerms: '50% Deposit Required, Balance on Delivery',
  bankDetails: {
    bankName: 'Ecobank Ghana (Ridge Branch)',
    accountName: 'AfroPixel Studios Ltd',
    accountNumber: '1441002349012',
    branch: 'Ridge Head Office, Accra',
    sortCode: '130101',
    swiftCode: 'ECOCGHAC',
  },
  mobileMoneyDetails: {
    primaryProvider: 'MTN Mobile Money',
    accounts: [
      {
        provider: 'MTN Mobile Money',
        accountName: 'AfroPixel Creative Hub (Emmanuel Osei)',
        accountNumber: '0248901234',
        merchantId: '619283',
      },
      {
        provider: 'Telecel Cash',
        accountName: 'AfroPixel Hub',
        accountNumber: '0204567890',
      },
      {
        provider: 'AirtelTigo Money',
        accountName: 'AfroPixel Studios',
        accountNumber: '0261122334',
      },
    ],
    instructions: 'Please use your Invoice Number as the Payment Reference. Screenshot/receipt can be shared on WhatsApp for instant confirmation.',
  },
  defaultTaxRate: 15,
  defaultTaxLabel: 'VAT / NHIL / GETFund (15%)',
  defaultInvoiceNotes: 'Thank you for choosing AfroPixel! All print artworks are proof-checked and protected under our quality guarantee.',
  defaultInvoiceTerms: '1. 50% deposit required before artwork finalization & print production.\n2. Final balance payable upon job completion / before dispatch.\n3. Revisions beyond 3 iterations are billed at standard hourly rates.\n4. Late payments accrue a 2.5% monthly administrative fee.',
  invoicePrefix: 'INV',
  receiptPrefix: 'REC',
  invoiceSequence: 104,
  receiptSequence: 88,
  defaultTemplate: 'modern',
  themeColor: '#4f46e5', // Indigo
  secondaryColor: '#06b6d4', // Cyan
  fontFamily: 'Outfit',
  logoPosition: 'left',
  customFooterText: 'AfroPixel Creative & Print Hub — Delivering Bold Ideas & Flawless Output across West Africa',
  watermarksEnabled: true,
};

// Default Creative Services Presets
export const DEFAULT_SERVICES: CreativeService[] = [
  // Graphic Design
  {
    id: 'srv_01',
    businessId: 'biz_001',
    name: 'Brand Identity & Logo Suite',
    category: 'Graphic Design',
    defaultPrice: 1500,
    defaultUnit: 'package',
    description: 'Primary logo, alternate marks, typography pairing, color palette & brand style guide PDF.',
    turnaroundTime: '5-7 business days',
    popular: true,
  },
  {
    id: 'srv_02',
    businessId: 'biz_001',
    name: 'Marketing Flyer & Poster Design',
    category: 'Graphic Design',
    defaultPrice: 250,
    defaultUnit: 'design',
    description: 'High-resolution print-ready & social media adapted promotional design.',
    turnaroundTime: '24-48 hours',
    popular: true,
  },
  {
    id: 'srv_03',
    businessId: 'biz_001',
    name: 'Executive Business Card Design',
    category: 'Graphic Design',
    defaultPrice: 180,
    defaultUnit: 'design',
    description: 'Double-sided modern card design with print bleed & spot UV guides.',
    turnaroundTime: '24 hours',
  },
  {
    id: 'srv_04',
    businessId: 'biz_001',
    name: 'Product Packaging & Label Design',
    category: 'Packaging',
    defaultPrice: 850,
    defaultUnit: 'sku',
    description: 'Dieline layout, 3D mockup render, and print-ready CMYK separation.',
    turnaroundTime: '3-5 business days',
  },
  {
    id: 'srv_05',
    businessId: 'biz_001',
    name: 'Monthly Social Media Content Kit (12 Posts)',
    category: 'Digital Marketing',
    defaultPrice: 1200,
    defaultUnit: 'monthly kit',
    description: '12 branded carousel/single graphics with captions & story templates.',
    turnaroundTime: 'Monthly retainer',
    popular: true,
  },
  // Printing
  {
    id: 'srv_06',
    businessId: 'biz_001',
    name: 'A3 Full-Color Flyers (300gsm Gloss)',
    category: 'Printing',
    defaultPrice: 6.5,
    defaultUnit: 'unit',
    description: 'High-density offset digital print on heavy cardstock with rich color saturation.',
    turnaroundTime: '24 hours',
    popular: true,
  },
  {
    id: 'srv_07',
    businessId: 'biz_001',
    name: 'Premium Matt Laminated Business Cards',
    category: 'Printing',
    defaultPrice: 220,
    defaultUnit: 'pack of 100',
    description: '400gsm Art Card with velvety soft-touch matte lamination.',
    turnaroundTime: '48 hours',
    popular: true,
  },
  {
    id: 'srv_08',
    businessId: 'biz_001',
    name: 'Roll-Up Pull Banner (Luxury Aluminum Base)',
    category: 'Printing',
    defaultPrice: 450,
    defaultUnit: 'unit',
    description: '85x200cm anti-curl PET film in padded carrying bag.',
    turnaroundTime: '24 hours',
    popular: true,
  },
  {
    id: 'srv_09',
    businessId: 'biz_001',
    name: 'Custom Branded T-Shirt Screen Printing',
    category: 'Printing',
    defaultPrice: 85,
    defaultUnit: 'piece',
    description: '100% heavy combed cotton with high-durability plastisol/discharge screen print.',
    turnaroundTime: '3-4 business days',
  },
  {
    id: 'srv_10',
    businessId: 'biz_001',
    name: 'Sublimation Ceramic Mug Printing',
    category: 'Printing',
    defaultPrice: 45,
    defaultUnit: 'unit',
    description: '11oz Glossy White Ceramic Mug in individual gift box.',
    turnaroundTime: '24 hours',
  },
  // Signage & Large Format
  {
    id: 'srv_11',
    businessId: 'biz_001',
    name: '3D Acrylic Backlit Storefront Signage',
    category: 'Signage & Large Format',
    defaultPrice: 3200,
    defaultUnit: 'installation',
    description: 'Laser-cut 3D acrylic letters with waterproof Samsung LED modules & transformer.',
    turnaroundTime: '7-10 business days',
  },
  {
    id: 'srv_12',
    businessId: 'biz_001',
    name: 'Large Format Flexi Banner (High Res)',
    category: 'Signage & Large Format',
    defaultPrice: 55,
    defaultUnit: 'sq. meter',
    description: 'Heavy duty 440gsm vinyl with reinforced eyelets and edge hemming.',
    turnaroundTime: '24 hours',
  },
  // Photography & Video
  {
    id: 'srv_13',
    businessId: 'biz_001',
    name: 'Commercial Product Photography Session',
    category: 'Photography & Video',
    defaultPrice: 1200,
    defaultUnit: 'half day',
    description: 'Studio lighting, 15 retouched hero shots, transparent PNG cutouts.',
    turnaroundTime: '3 business days',
  },
  {
    id: 'srv_14',
    businessId: 'biz_001',
    name: '4K Corporate Brand Story Video (60s)',
    category: 'Photography & Video',
    defaultPrice: 3800,
    defaultUnit: 'production',
    description: 'Pre-production script, 1-day shoot, color grading, sound design & licensed soundtrack.',
    turnaroundTime: '10 business days',
  },
];

// Sample Initial Clients
export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'cli_001',
    businessId: 'biz_001',
    name: 'Kofi Mensah',
    companyName: 'Nexus Fintech Ghana Ltd',
    phone: '+233 24 555 1201',
    email: 'kofi.mensah@nexusfintech.com.gh',
    address: 'Suite 4B, Heritage Tower, Airport City, Accra',
    notes: 'Key enterprise client. Prefers MTN MoMo or Direct Bank wire.',
    preferredCurrency: 'GHS',
    tags: ['Fintech', 'Corporate', 'VIP'],
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'cli_002',
    businessId: 'biz_001',
    name: 'Ama Serwaa Poku',
    companyName: 'Serwaa Organic Skin & Beauty',
    phone: '+233 20 888 4432',
    email: 'ama@serwaabeauty.com',
    address: 'East Legon, near American House, Accra',
    notes: 'Regular orders for packaging labels and monthly flyer prints.',
    preferredCurrency: 'GHS',
    tags: ['Beauty', 'Packaging', 'Retail'],
    createdAt: '2026-07-02T14:30:00Z',
  },
  {
    id: 'cli_003',
    businessId: 'biz_001',
    name: 'Kwame Boateng',
    companyName: 'Accra Food & Music Festival',
    phone: '+233 27 711 9900',
    email: 'kwame@accrafoodfest.org',
    address: 'Laboma Beach Front, Accra',
    notes: 'Large format event signage, wristbands, and artist promo graphics.',
    preferredCurrency: 'GHS',
    tags: ['Events', 'Signage', 'Printing'],
    createdAt: '2026-07-15T09:15:00Z',
  },
  {
    id: 'cli_004',
    businessId: 'biz_001',
    name: 'Dr. Joyce Adom',
    companyName: 'Apex Specialist Medical Centre',
    phone: '+233 50 333 7788',
    email: 'dr.adom@apexmedical.gh',
    address: '14 Cantonments Road, Accra',
    notes: 'Hospital stationery, prescription pads, and acrylic directory signage.',
    preferredCurrency: 'GHS',
    tags: ['Healthcare', 'Corporate'],
    createdAt: '2026-08-01T11:45:00Z',
  },
];

// Sample Initial Invoices
export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    businessId: 'biz_001',
    invoiceNumber: 'INV-2026-0101',
    invoiceDate: '2026-08-10',
    dueDate: '2026-08-24',
    status: 'paid',
    clientId: 'cli_001',
    clientName: 'Kofi Mensah',
    clientCompanyName: 'Nexus Fintech Ghana Ltd',
    clientPhone: '+233 24 555 1201',
    clientEmail: 'kofi.mensah@nexusfintech.com.gh',
    clientAddress: 'Suite 4B, Heritage Tower, Airport City, Accra',
    items: [
      {
        id: 'item_101',
        description: 'Brand Identity & Logo Suite (Complete Brand System)',
        category: 'Graphic Design',
        quantity: 1,
        unitPrice: 1500,
        discount: 0,
        discountType: 'percentage',
        taxRate: 15,
        total: 1500,
        specifications: 'Primary & secondary vector logos, color guidelines, typography system',
      },
      {
        id: 'item_102',
        description: 'Premium Matt Laminated Business Cards (Pack of 500)',
        category: 'Printing',
        quantity: 5,
        unitPrice: 200,
        discount: 50,
        discountType: 'fixed',
        taxRate: 15,
        total: 950,
        specifications: '400gsm Art Card, Velvet Matte, Spot UV logo, 5 executive names',
      },
    ],
    subtotal: 2450,
    discountTotal: 50,
    taxTotal: 367.5,
    grandTotal: 2817.5,
    amountPaid: 2817.5,
    balanceDue: 0,
    currency: 'GHS',
    currencySymbol: 'GH₵',
    paymentMethodPreference: 'Bank Transfer',
    paymentInstructions: 'Paid via Ecobank Direct Bank Transfer. Ref: ECO-8839219',
    notes: 'Thank you for your business! Files delivered via cloud drive.',
    terms: '50% deposit received, remaining balance cleared on final print delivery.',
    template: 'modern',
    themeColor: '#4f46e5',
    paidAt: '2026-08-14T16:20:00Z',
    createdAt: '2026-08-10T10:30:00Z',
    updatedAt: '2026-08-14T16:20:00Z',
  },
  {
    id: 'inv_002',
    businessId: 'biz_001',
    invoiceNumber: 'INV-2026-0102',
    invoiceDate: '2026-08-15',
    dueDate: '2026-08-29',
    status: 'partially_paid',
    clientId: 'cli_002',
    clientName: 'Ama Serwaa Poku',
    clientCompanyName: 'Serwaa Organic Skin & Beauty',
    clientPhone: '+233 20 888 4432',
    clientEmail: 'ama@serwaabeauty.com',
    clientAddress: 'East Legon, near American House, Accra',
    items: [
      {
        id: 'item_201',
        description: 'Product Packaging & Label Design (4 Product SKUs)',
        category: 'Packaging',
        quantity: 4,
        unitPrice: 750,
        discount: 10,
        discountType: 'percentage',
        taxRate: 15,
        total: 2700,
        specifications: 'Body butter, Glow serum, Face wash, Body oil dieline & 3D renders',
      },
      {
        id: 'item_202',
        description: 'Waterproof Vinyl Product Labels (1,000 pcs)',
        category: 'Printing',
        quantity: 10,
        unitPrice: 120,
        discount: 0,
        discountType: 'fixed',
        taxRate: 15,
        total: 1200,
        specifications: 'Die-cut gold foil accent waterproof cosmetic vinyl',
      },
    ],
    subtotal: 3900,
    discountTotal: 300,
    taxTotal: 585,
    grandTotal: 4485,
    amountPaid: 2500,
    balanceDue: 1985,
    currency: 'GHS',
    currencySymbol: 'GH₵',
    paymentMethodPreference: 'MTN Mobile Money',
    paymentInstructions: 'MTN MoMo: 0248901234 (Emmanuel Osei - AfroPixel). Use INV-2026-0102 as reference.',
    notes: '50% initial production deposit received. Remaining balance due before shipment.',
    terms: 'Balance due upon sample approval before final batch delivery.',
    template: 'creative',
    themeColor: '#d946ef', // Fuchsia
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-08-16T14:10:00Z',
  },
  {
    id: 'inv_003',
    businessId: 'biz_001',
    invoiceNumber: 'INV-2026-0103',
    invoiceDate: '2026-08-18',
    dueDate: '2026-09-01',
    status: 'unpaid',
    clientId: 'cli_003',
    clientName: 'Kwame Boateng',
    clientCompanyName: 'Accra Food & Music Festival',
    clientPhone: '+233 27 711 9900',
    clientEmail: 'kwame@accrafoodfest.org',
    clientAddress: 'Laboma Beach Front, Accra',
    items: [
      {
        id: 'item_301',
        description: 'Roll-Up Pull Banner Stands (Heavy Duty)',
        category: 'Printing',
        quantity: 4,
        unitPrice: 450,
        discount: 0,
        discountType: 'percentage',
        taxRate: 15,
        total: 1800,
        specifications: '85x200cm, Stage side branding & entrance sponsors',
      },
      {
        id: 'item_302',
        description: 'Large Format Flexi Banner (Stage Backdrop)',
        category: 'Signage & Large Format',
        quantity: 24,
        unitPrice: 55,
        discount: 0,
        discountType: 'fixed',
        taxRate: 15,
        total: 1320,
        specifications: '6m x 4m heavy flexi with reinforced eyelets',
      },
    ],
    subtotal: 3120,
    discountTotal: 0,
    taxTotal: 468,
    grandTotal: 3588,
    amountPaid: 0,
    balanceDue: 3588,
    currency: 'GHS',
    currencySymbol: 'GH₵',
    paymentMethodPreference: 'MTN Mobile Money',
    paymentInstructions: 'Please pay via MTN MoMo 0248901234 or Telecel Cash 0204567890.',
    notes: 'Please approve design proofs promptly to meet festival setup schedule.',
    terms: 'Payment due on delivery or net 14 days.',
    template: 'printing-hub',
    themeColor: '#059669', // Emerald
    createdAt: '2026-08-18T09:00:00Z',
    updatedAt: '2026-08-18T09:00:00Z',
  },
];

// Sample Initial Payments
export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay_001',
    businessId: 'biz_001',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2026-0101',
    clientId: 'cli_001',
    clientName: 'Kofi Mensah',
    receiptId: 'rec_001',
    receiptNumber: 'REC-2026-0086',
    amount: 1400,
    paymentDate: '2026-08-10',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'ECO-DEP-88391',
    notes: 'Initial 50% commitment deposit for brand identity suite',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    createdAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'pay_002',
    businessId: 'biz_001',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2026-0101',
    clientId: 'cli_001',
    clientName: 'Kofi Mensah',
    receiptId: 'rec_002',
    receiptNumber: 'REC-2026-0087',
    amount: 1417.5,
    paymentDate: '2026-08-14',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'ECO-BAL-99120',
    notes: 'Final balance payment upon delivery of card prints and logo files',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    createdAt: '2026-08-14T16:20:00Z',
  },
  {
    id: 'pay_003',
    businessId: 'biz_001',
    invoiceId: 'inv_002',
    invoiceNumber: 'INV-2026-0102',
    clientId: 'cli_002',
    clientName: 'Ama Serwaa Poku',
    receiptId: 'rec_003',
    receiptNumber: 'REC-2026-0088',
    amount: 2500,
    paymentDate: '2026-08-16',
    paymentMethod: 'MTN Mobile Money',
    transactionReference: 'MTN-MM-4491823901',
    notes: 'Initial deposit for skincare packaging design & vinyl label print batch',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    createdAt: '2026-08-16T14:10:00Z',
  },
];

// Sample Initial Receipts
export const DEFAULT_RECEIPTS: Receipt[] = [
  {
    id: 'rec_001',
    businessId: 'biz_001',
    receiptNumber: 'REC-2026-0086',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2026-0101',
    paymentId: 'pay_001',
    clientId: 'cli_001',
    clientName: 'Kofi Mensah',
    clientPhone: '+233 24 555 1201',
    clientEmail: 'kofi.mensah@nexusfintech.com.gh',
    clientAddress: 'Suite 4B, Heritage Tower, Airport City, Accra',
    date: '2026-08-10',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'ECO-DEP-88391',
    description: 'Deposit payment for Brand Identity Suite & Business Cards',
    amountPaid: 1400,
    totalAmount: 2817.5,
    balanceRemaining: 1417.5,
    paymentStatus: 'Deposit / Partial Payment',
    notes: 'Thank you for your initial deposit. Artwork and initial concepts underway.',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    template: 'modern',
    createdAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'rec_002',
    businessId: 'biz_001',
    receiptNumber: 'REC-2026-0087',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2026-0101',
    paymentId: 'pay_002',
    clientId: 'cli_001',
    clientName: 'Kofi Mensah',
    clientPhone: '+233 24 555 1201',
    clientEmail: 'kofi.mensah@nexusfintech.com.gh',
    clientAddress: 'Suite 4B, Heritage Tower, Airport City, Accra',
    date: '2026-08-14',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'ECO-BAL-99120',
    description: 'Final balance payment for Invoice INV-2026-0101',
    amountPaid: 1417.5,
    totalAmount: 2817.5,
    balanceRemaining: 0,
    paymentStatus: 'Final Balance Paid',
    notes: 'Account fully settled. All deliverables successfully dispatched and delivered.',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    template: 'modern',
    createdAt: '2026-08-14T16:20:00Z',
  },
  {
    id: 'rec_003',
    businessId: 'biz_001',
    receiptNumber: 'REC-2026-0088',
    invoiceId: 'inv_002',
    invoiceNumber: 'INV-2026-0102',
    paymentId: 'pay_003',
    clientId: 'cli_002',
    clientName: 'Ama Serwaa Poku',
    clientPhone: '+233 20 888 4432',
    clientEmail: 'ama@serwaabeauty.com',
    clientAddress: 'East Legon, near American House, Accra',
    date: '2026-08-16',
    paymentMethod: 'MTN Mobile Money',
    transactionReference: 'MTN-MM-4491823901',
    description: 'Part payment for 4 SKU Cosmetic Labels & Print',
    amountPaid: 2500,
    totalAmount: 4485,
    balanceRemaining: 1985,
    paymentStatus: 'Deposit / Partial Payment',
    notes: 'Received via MTN MoMo. Remaining balance of GH₵ 1,985 due before batch delivery.',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    template: 'creative',
    createdAt: '2026-08-16T14:10:00Z',
  },
];

export const DEFAULT_USER: User = {
  id: 'user_001',
  email: 'emmanuel@afropixelcreatives.com',
  name: 'Emmanuel Osei (Creative Director)',
  role: 'owner',
  businessId: 'biz_001',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T08:00:00Z',
};

// Listeners for reactive updates
type DbListener = () => void;
const listeners = new Set<DbListener>();

function notifyChange() {
  listeners.forEach((l) => l());
}

export const db = {
  subscribe(listener: DbListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Auth User
  getUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      this.setUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USER;
    }
  },

  setUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    notifyChange();
  },

  // Business Profile
  getBusinessProfile(): BusinessProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (!raw) {
      this.setBusinessProfile(DEFAULT_BUSINESS_PROFILE);
      return DEFAULT_BUSINESS_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BUSINESS_PROFILE;
    }
  },

  setBusinessProfile(profile: BusinessProfile) {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(profile));
    notifyChange();
  },

  updateBusinessProfile(updates: Partial<BusinessProfile>) {
    const current = this.getBusinessProfile();
    const updated = { ...current, ...updates };
    this.setBusinessProfile(updated);
    return updated;
  },

  // Increment Sequence Numbers
  getNextInvoiceNumber(): string {
    const profile = this.getBusinessProfile();
    const seq = profile.invoiceSequence || 101;
    const year = new Date().getFullYear();
    const padded = String(seq).padStart(4, '0');
    return `${profile.invoicePrefix || 'INV'}-${year}-${padded}`;
  },

  incrementInvoiceSequence(): number {
    const profile = this.getBusinessProfile();
    const nextSeq = (profile.invoiceSequence || 101) + 1;
    this.updateBusinessProfile({ invoiceSequence: nextSeq });
    return nextSeq;
  },

  getNextReceiptNumber(): string {
    const profile = this.getBusinessProfile();
    const seq = profile.receiptSequence || 89;
    const year = new Date().getFullYear();
    const padded = String(seq).padStart(4, '0');
    return `${profile.receiptPrefix || 'REC'}-${year}-${padded}`;
  },

  incrementReceiptSequence(): number {
    const profile = this.getBusinessProfile();
    const nextSeq = (profile.receiptSequence || 89) + 1;
    this.updateBusinessProfile({ receiptSequence: nextSeq });
    return nextSeq;
  },

  // Clients
  getClients(): Client[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      this.setClients(DEFAULT_CLIENTS);
      return DEFAULT_CLIENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CLIENTS;
    }
  },

  setClients(clients: Client[]) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    notifyChange();
  },

  getClientById(id: string): Client | undefined {
    return this.getClients().find((c) => c.id === id);
  },

  saveClient(client: Partial<Client> & { name: string; phone: string; email: string }): Client {
    const clients = this.getClients();
    const business = this.getBusinessProfile();

    if (client.id) {
      const index = clients.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        const updated: Client = {
          ...clients[index],
          ...client,
          updatedAt: new Date().toISOString(),
        } as Client;
        clients[index] = updated;
        this.setClients(clients);
        return updated;
      }
    }

    // New Client
    const newClient: Client = {
      id: `cli_${Date.now()}`,
      businessId: business.id,
      name: client.name,
      companyName: client.companyName || '',
      phone: client.phone,
      email: client.email,
      address: client.address || '',
      notes: client.notes || '',
      preferredCurrency: client.preferredCurrency || business.currency,
      tags: client.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clients.unshift(newClient);
    this.setClients(clients);
    return newClient;
  },

  deleteClient(id: string): boolean {
    const clients = this.getClients().filter((c) => c.id !== id);
    this.setClients(clients);
    return true;
  },

  // Invoices
  getInvoices(): Invoice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      this.setInvoices(DEFAULT_INVOICES);
      return DEFAULT_INVOICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_INVOICES;
    }
  },

  setInvoices(invoices: Invoice[]) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    notifyChange();
  },

  getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find((i) => i.id === id);
  },

  saveInvoice(invoiceData: Partial<Invoice> & { clientId: string; items: InvoiceItem[] }): Invoice {
    const invoices = this.getInvoices();
    const business = this.getBusinessProfile();
    const client = this.getClientById(invoiceData.clientId);

    // Calculate totals accurately
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const calculatedItems = (invoiceData.items || []).map((item) => {
      const itemSub = item.quantity * item.unitPrice;
      let itemDisc = 0;
      if (item.discountType === 'percentage') {
        itemDisc = (itemSub * (item.discount || 0)) / 100;
      } else {
        itemDisc = item.discount || 0;
      }
      const itemAfterDisc = Math.max(0, itemSub - itemDisc);
      const itemTax = (itemAfterDisc * (item.taxRate || 0)) / 100;
      const itemTotal = itemAfterDisc; // Line item before tax or with tax? We calculate grand total with taxes

      subtotal += itemSub;
      discountTotal += itemDisc;
      taxTotal += itemTax;

      return {
        ...item,
        id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        total: itemAfterDisc,
      };
    });

    const grandTotal = Math.max(0, subtotal - discountTotal + taxTotal);
    const amountPaid = invoiceData.amountPaid || 0;
    const balanceDue = Math.max(0, grandTotal - amountPaid);

    // Determine status automatically if not manually forced to cancelled or draft
    let status = invoiceData.status || 'unpaid';
    if (status !== 'cancelled' && status !== 'draft') {
      if (balanceDue <= 0.01 && grandTotal > 0) {
        status = 'paid';
      } else if (amountPaid > 0 && balanceDue > 0) {
        status = 'partially_paid';
      } else if (invoiceData.dueDate && new Date(invoiceData.dueDate) < new Date() && status !== 'paid') {
        status = 'overdue';
      } else {
        status = invoiceData.status || 'unpaid';
      }
    }

    if (invoiceData.id) {
      const index = invoices.findIndex((i) => i.id === invoiceData.id);
      if (index !== -1) {
        const updated: Invoice = {
          ...invoices[index],
          ...invoiceData,
          clientName: client?.name || invoiceData.clientName || invoices[index].clientName,
          clientCompanyName: client?.companyName ?? invoiceData.clientCompanyName ?? invoices[index].clientCompanyName,
          clientPhone: client?.phone || invoiceData.clientPhone || invoices[index].clientPhone,
          clientEmail: client?.email || invoiceData.clientEmail || invoices[index].clientEmail,
          clientAddress: client?.address ?? invoiceData.clientAddress ?? invoices[index].clientAddress,
          items: calculatedItems,
          subtotal,
          discountTotal,
          taxTotal,
          grandTotal,
          amountPaid,
          balanceDue,
          status,
          currency: invoiceData.currency || invoices[index].currency || business.currency,
          currencySymbol: invoiceData.currencySymbol || (invoiceData.currency === 'USD' ? '$' : 'GH₵'),
          updatedAt: new Date().toISOString(),
        };
        invoices[index] = updated;
        this.setInvoices(invoices);
        return updated;
      }
    }

    // New invoice
    const newNumber = invoiceData.invoiceNumber || this.getNextInvoiceNumber();
    this.incrementInvoiceSequence();

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      businessId: business.id,
      invoiceNumber: newNumber,
      invoiceDate: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status,
      clientId: invoiceData.clientId,
      clientName: client?.name || invoiceData.clientName || 'Valued Client',
      clientCompanyName: client?.companyName || invoiceData.clientCompanyName || '',
      clientPhone: client?.phone || invoiceData.clientPhone || '',
      clientEmail: client?.email || invoiceData.clientEmail || '',
      clientAddress: client?.address || invoiceData.clientAddress || '',
      items: calculatedItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      amountPaid,
      balanceDue,
      currency: invoiceData.currency || business.currency,
      currencySymbol: invoiceData.currencySymbol || (invoiceData.currency === 'USD' ? '$' : 'GH₵'),
      paymentMethodPreference: invoiceData.paymentMethodPreference || business.mobileMoneyDetails.primaryProvider,
      paymentInstructions: invoiceData.paymentInstructions || business.mobileMoneyDetails.instructions,
      notes: invoiceData.notes || business.defaultInvoiceNotes,
      terms: invoiceData.terms || business.defaultInvoiceTerms,
      template: invoiceData.template || business.defaultTemplate,
      themeColor: invoiceData.themeColor || business.themeColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    invoices.unshift(newInvoice);
    this.setInvoices(invoices);
    return newInvoice;
  },

  deleteInvoice(id: string): boolean {
    const invoices = this.getInvoices().filter((i) => i.id !== id);
    this.setInvoices(invoices);
    return true;
  },

  duplicateInvoice(id: string): Invoice | undefined {
    const original = this.getInvoiceById(id);
    if (!original) return undefined;

    const newNum = this.getNextInvoiceNumber();
    this.incrementInvoiceSequence();

    const duplicated: Invoice = {
      ...original,
      id: `inv_${Date.now()}`,
      invoiceNumber: newNum,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'draft',
      amountPaid: 0,
      balanceDue: original.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: original.items.map((it) => ({ ...it, id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` })),
    };

    const invoices = this.getInvoices();
    invoices.unshift(duplicated);
    this.setInvoices(invoices);
    return duplicated;
  },

  // Payments & Receipts workflow
  getPayments(): Payment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      this.setPayments(DEFAULT_PAYMENTS);
      return DEFAULT_PAYMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PAYMENTS;
    }
  },

  setPayments(payments: Payment[]) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    notifyChange();
  },

  getReceipts(): Receipt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (!raw) {
      this.setReceipts(DEFAULT_RECEIPTS);
      return DEFAULT_RECEIPTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_RECEIPTS;
    }
  },

  setReceipts(receipts: Receipt[]) {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
    notifyChange();
  },

  getReceiptById(id: string): Receipt | undefined {
    return this.getReceipts().find((r) => r.id === id);
  },

  recordPayment(params: {
    invoiceId: string;
    amount: number;
    paymentMethod: any;
    paymentDate?: string;
    transactionReference?: string;
    notes?: string;
    generateReceipt?: boolean;
  }): { payment: Payment; receipt?: Receipt; updatedInvoice: Invoice } {
    const invoice = this.getInvoiceById(params.invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const business = this.getBusinessProfile();
    const paymentAmount = Number(params.amount);
    const newAmountPaid = (invoice.amountPaid || 0) + paymentAmount;
    const newBalanceDue = Math.max(0, invoice.grandTotal - newAmountPaid);

    let newStatus = invoice.status;
    if (newBalanceDue <= 0.01) {
      newStatus = 'paid';
    } else {
      newStatus = 'partially_paid';
    }

    // Save updated invoice
    const updatedInvoice = this.saveInvoice({
      ...invoice,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newStatus,
      paidAt: newStatus === 'paid' ? new Date().toISOString() : invoice.paidAt,
    });

    const paymentId = `pay_${Date.now()}`;
    const paymentDate = params.paymentDate || new Date().toISOString().split('T')[0];

    // Optional or default Receipt Generation
    let createdReceipt: Receipt | undefined;
    let receiptNum: string | undefined;

    if (params.generateReceipt !== false) {
      receiptNum = this.getNextReceiptNumber();
      this.incrementReceiptSequence();

      let paymentStatusLabel: Receipt['paymentStatus'] = 'Deposit / Partial Payment';
      if (newBalanceDue <= 0.01) {
        paymentStatusLabel = newAmountPaid === paymentAmount ? 'Fully Paid' : 'Final Balance Paid';
      }

      createdReceipt = {
        id: `rec_${Date.now()}`,
        businessId: business.id,
        receiptNumber: receiptNum,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        paymentId: paymentId,
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        clientPhone: invoice.clientPhone,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        date: paymentDate,
        paymentMethod: params.paymentMethod,
        transactionReference: params.transactionReference,
        description: `Payment for Invoice ${invoice.invoiceNumber} (${invoice.items.map((i) => i.description).slice(0, 2).join(', ')})`,
        amountPaid: paymentAmount,
        totalAmount: invoice.grandTotal,
        balanceRemaining: newBalanceDue,
        paymentStatus: paymentStatusLabel,
        notes: params.notes || `Official payment receipt for ${invoice.invoiceNumber}. Thank you for your business.`,
        currency: invoice.currency,
        currencySymbol: invoice.currencySymbol,
        template: invoice.template || business.defaultTemplate,
        createdAt: new Date().toISOString(),
      };

      const receipts = this.getReceipts();
      receipts.unshift(createdReceipt);
      this.setReceipts(receipts);
    }

    const newPayment: Payment = {
      id: paymentId,
      businessId: business.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      receiptId: createdReceipt?.id,
      receiptNumber: receiptNum,
      amount: paymentAmount,
      paymentDate: paymentDate,
      paymentMethod: params.paymentMethod,
      transactionReference: params.transactionReference,
      notes: params.notes,
      currency: invoice.currency,
      currencySymbol: invoice.currencySymbol,
      createdAt: new Date().toISOString(),
    };

    const payments = this.getPayments();
    payments.unshift(newPayment);
    this.setPayments(payments);

    return { payment: newPayment, receipt: createdReceipt, updatedInvoice };
  },

  deleteReceipt(id: string): boolean {
    const receipts = this.getReceipts().filter((r) => r.id !== id);
    this.setReceipts(receipts);
    return true;
  },

  // Creative Services Catalog
  getServices(): CreativeService[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!raw) {
      this.setServices(DEFAULT_SERVICES);
      return DEFAULT_SERVICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SERVICES;
    }
  },

  setServices(services: CreativeService[]) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    notifyChange();
  },

  saveService(service: Partial<CreativeService> & { name: string; defaultPrice: number }): CreativeService {
    const services = this.getServices();
    const business = this.getBusinessProfile();

    if (service.id) {
      const idx = services.findIndex((s) => s.id === service.id);
      if (idx !== -1) {
        const updated = { ...services[idx], ...service } as CreativeService;
        services[idx] = updated;
        this.setServices(services);
        return updated;
      }
    }

    const newService: CreativeService = {
      id: `srv_${Date.now()}`,
      businessId: business.id,
      name: service.name,
      category: service.category || 'Graphic Design',
      defaultPrice: Number(service.defaultPrice),
      defaultUnit: service.defaultUnit || 'unit',
      description: service.description || '',
      turnaroundTime: service.turnaroundTime || '24-48 hours',
      popular: service.popular || false,
    };

    services.unshift(newService);
    this.setServices(services);
    return newService;
  },

  deleteService(id: string): boolean {
    const services = this.getServices().filter((s) => s.id !== id);
    this.setServices(services);
    return true;
  },

  // Client Statement Generator
  getClientStatement(clientId: string): {
    client: Client;
    invoices: Invoice[];
    payments: Payment[];
    totalInvoiced: number;
    totalPaid: number;
    balanceDue: number;
  } | null {
    const client = this.getClientById(clientId);
    if (!client) return null;

    const invoices = this.getInvoices().filter((i) => i.clientId === clientId);
    const payments = this.getPayments().filter((p) => p.clientId === clientId);

    const totalInvoiced = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const balanceDue = Math.max(0, totalInvoiced - totalPaid);

    return {
      client,
      invoices,
      payments,
      totalInvoiced,
      totalPaid,
      balanceDue,
    };
  },

  // Backup and Restore
  exportAllDataJSON(): string {
    const data = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      business: this.getBusinessProfile(),
      clients: this.getClients(),
      invoices: this.getInvoices(),
      receipts: this.getReceipts(),
      payments: this.getPayments(),
      services: this.getServices(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllDataJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed.user));
      if (parsed.business) localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(parsed.business));
      if (parsed.clients) localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(parsed.clients));
      if (parsed.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(parsed.invoices));
      if (parsed.receipts) localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(parsed.receipts));
      if (parsed.payments) localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(parsed.payments));
      if (parsed.services) localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(parsed.services));
      notifyChange();
      return true;
    } catch (e) {
      console.error('Failed to import database JSON', e);
      return false;
    }
  },

  resetToDefaultData() {
    this.setUser(DEFAULT_USER);
    this.setBusinessProfile(DEFAULT_BUSINESS_PROFILE);
    this.setClients(DEFAULT_CLIENTS);
    this.setInvoices(DEFAULT_INVOICES);
    this.setReceipts(DEFAULT_RECEIPTS);
    this.setPayments(DEFAULT_PAYMENTS);
    this.setServices(DEFAULT_SERVICES);
    notifyChange();
  },
};
