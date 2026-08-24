import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import {
  Invoice,
  Receipt,
  Client,
  Payment,
  BusinessProfile,
  CreativeService,
} from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/views/DashboardView';
import { InvoicesView } from './components/views/InvoicesView';
import { ReceiptsView } from './components/views/ReceiptsView';
import { ClientsView } from './components/views/ClientsView';
import { PaymentsView } from './components/views/PaymentsView';
import { ServicesView } from './components/views/ServicesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { InvoiceFormModal } from './components/invoices/InvoiceFormModal';
import { InvoiceViewModal } from './components/invoices/InvoiceViewModal';
import { RecordPaymentModal } from './components/payments/RecordPaymentModal';
import { ReceiptViewModal } from './components/receipts/ReceiptViewModal';
import { ReceiptFormModal } from './components/receipts/ReceiptFormModal';
import { ClientFormModal } from './components/clients/ClientFormModal';
import { ClientStatementModal } from './components/clients/ClientStatementModal';
import { ServiceFormModal } from './components/services/ServiceFormModal';
import { AuthModal } from './components/auth/AuthModal';

function AppContent() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Database State
  const [business, setBusiness] = useState<BusinessProfile>(db.getBusinessProfile());
  const [invoices, setInvoices] = useState<Invoice[]>(db.getInvoices());
  const [receipts, setReceipts] = useState<Receipt[]>(db.getReceipts());
  const [clients, setClients] = useState<Client[]>(db.getClients());
  const [payments, setPayments] = useState<Payment[]>(db.getPayments());
  const [services, setServices] = useState<CreativeService[]>(db.getServices());

  // Modal Triggers State
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [initialClientIdForInvoice, setInitialClientIdForInvoice] = useState<string | undefined>(undefined);

  const [isInvoiceViewOpen, setIsInvoiceViewOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  const [isReceiptViewOpen, setIsReceiptViewOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<Receipt | null>(null);

  const [isReceiptFormOpen, setIsReceiptFormOpen] = useState(false);

  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isClientStatementOpen, setIsClientStatementOpen] = useState(false);
  const [selectedClientForStatement, setSelectedClientForStatement] = useState<Client | null>(null);

  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<CreativeService | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Subscribe to central DB state changes
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setBusiness(db.getBusinessProfile());
      setInvoices(db.getInvoices());
      setReceipts(db.getReceipts());
      setClients(db.getClients());
      setPayments(db.getPayments());
      setServices(db.getServices());
    });
    return unsubscribe;
  }, []);

  // Invoice Handlers
  const handleOpenCreateInvoice = (clientId?: string) => {
    setInvoiceToEdit(null);
    setInitialClientIdForInvoice(clientId);
    setIsInvoiceFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setInvoiceToEdit(invoice);
    setIsInvoiceViewOpen(false);
    setIsInvoiceFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoiceForView(invoice);
    setIsInvoiceViewOpen(true);
  };

  const handleDuplicateInvoice = (invoiceId: string) => {
    const dup = db.duplicateInvoice(invoiceId);
    if (dup) {
      setSelectedInvoiceForView(dup);
      setIsInvoiceViewOpen(true);
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      db.deleteInvoice(invoiceId);
      setIsInvoiceViewOpen(false);
    }
  };

  // Payment Handlers
  const handleOpenPaymentModal = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentRecorded = ({
    payment,
    receipt,
    updatedInvoice,
  }: {
    payment: any;
    receipt?: Receipt;
    updatedInvoice: Invoice;
  }) => {
    setSelectedInvoiceForView(updatedInvoice);
    if (receipt) {
      setSelectedReceiptForView(receipt);
      setIsReceiptViewOpen(true);
    }
  };

  // Receipt Handlers
  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceiptForView(receipt);
    setIsReceiptViewOpen(true);
  };

  const handleOpenCreateReceipt = () => {
    setIsReceiptFormOpen(true);
  };

  const handleReceiptCreated = (newReceipt: Receipt) => {
    setSelectedReceiptForView(newReceipt);
    setIsReceiptViewOpen(true);
  };

  // Client Handlers
  const handleOpenCreateClient = () => {
    setClientToEdit(null);
    setIsClientFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsClientFormOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to remove this client profile?')) {
      db.deleteClient(clientId);
    }
  };

  const handleOpenStatement = (client: Client) => {
    setSelectedClientForStatement(client);
    setIsClientStatementOpen(true);
  };

  // Service Handlers
  const handleOpenCreateService = () => {
    setServiceToEdit(null);
    setIsServiceFormOpen(true);
  };

  const handleEditService = (service: CreativeService) => {
    setServiceToEdit(service);
    setIsServiceFormOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to remove this service preset?')) {
      db.deleteService(serviceId);
    }
  };

  const handleQuickCreateInvoiceWithService = (service: CreativeService) => {
    handleOpenCreateInvoice();
  };

  return (
    <AppLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      business={business}
      invoices={invoices}
      onOpenCreateInvoice={() => handleOpenCreateInvoice()}
      onOpenAuthModal={() => setIsAuthModalOpen(true)}
    >
      {/* Dynamic View Routing */}
      {currentTab === 'dashboard' && (
        <DashboardView
          invoices={invoices}
          receipts={receipts}
          clients={clients}
          payments={payments}
          business={business}
          services={services}
          onOpenCreateInvoice={() => handleOpenCreateInvoice()}
          onOpenCreateReceipt={handleOpenCreateReceipt}
          onOpenCreateClient={handleOpenCreateClient}
          onViewInvoice={handleViewInvoice}
          onViewReceipt={handleViewReceipt}
          onOpenPaymentModal={handleOpenPaymentModal}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'invoices' && (
        <InvoicesView
          invoices={invoices}
          business={business}
          onOpenCreateInvoice={() => handleOpenCreateInvoice()}
          onViewInvoice={handleViewInvoice}
          onEditInvoice={handleEditInvoice}
          onDuplicateInvoice={handleDuplicateInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onOpenPaymentModal={handleOpenPaymentModal}
        />
      )}

      {currentTab === 'receipts' && (
        <ReceiptsView
          receipts={receipts}
          business={business}
          onOpenCreateReceipt={handleOpenCreateReceipt}
          onViewReceipt={handleViewReceipt}
        />
      )}

      {currentTab === 'clients' && (
        <ClientsView
          clients={clients}
          invoices={invoices}
          payments={payments}
          business={business}
          onOpenCreateClient={handleOpenCreateClient}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
          onOpenStatement={handleOpenStatement}
          onCreateInvoiceForClient={(clientId) => handleOpenCreateInvoice(clientId)}
        />
      )}

      {currentTab === 'payments' && (
        <PaymentsView payments={payments} business={business} />
      )}

      {currentTab === 'services' && (
        <ServicesView
          services={services}
          business={business}
          onOpenCreateService={handleOpenCreateService}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          onQuickCreateInvoiceWithService={handleQuickCreateInvoiceWithService}
        />
      )}

      {currentTab === 'reports' && (
        <ReportsView
          invoices={invoices}
          payments={payments}
          clients={clients}
          services={services}
          business={business}
        />
      )}

      {currentTab === 'settings' && (
        <SettingsView
          business={business}
          onUpdateBusiness={(updated) => setBusiness(updated)}
        />
      )}

      {/* Global Action Modals */}
      <InvoiceFormModal
        isOpen={isInvoiceFormOpen}
        onClose={() => setIsInvoiceFormOpen(false)}
        invoiceToEdit={invoiceToEdit}
        clients={clients}
        business={business}
        services={services}
        initialClientId={initialClientIdForInvoice}
        onSaved={(saved) => {
          setSelectedInvoiceForView(saved);
          setIsInvoiceViewOpen(true);
        }}
      />

      <InvoiceViewModal
        isOpen={isInvoiceViewOpen}
        onClose={() => setIsInvoiceViewOpen(false)}
        invoice={selectedInvoiceForView}
        business={business}
        onEdit={handleEditInvoice}
        onDuplicate={handleDuplicateInvoice}
        onDelete={handleDeleteInvoice}
        onOpenPaymentModal={handleOpenPaymentModal}
        onGenerateReceipt={(inv) => {
          setIsInvoiceViewOpen(false);
          setIsReceiptFormOpen(true);
        }}
      />

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={selectedInvoiceForPayment}
        business={business}
        onPaymentRecorded={handlePaymentRecorded}
      />

      <ReceiptViewModal
        isOpen={isReceiptViewOpen}
        onClose={() => setIsReceiptViewOpen(false)}
        receipt={selectedReceiptForView}
        business={business}
      />

      <ReceiptFormModal
        isOpen={isReceiptFormOpen}
        onClose={() => setIsReceiptFormOpen(false)}
        clients={clients}
        business={business}
        invoices={invoices}
        onReceiptCreated={handleReceiptCreated}
      />

      <ClientFormModal
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
        clientToEdit={clientToEdit}
        business={business}
        onSaved={(c) => {}}
      />

      <ClientStatementModal
        isOpen={isClientStatementOpen}
        onClose={() => setIsClientStatementOpen(false)}
        client={selectedClientForStatement}
        business={business}
        invoices={invoices}
        payments={payments}
      />

      <ServiceFormModal
        isOpen={isServiceFormOpen}
        onClose={() => setIsServiceFormOpen(false)}
        serviceToEdit={serviceToEdit}
        business={business}
        onSaved={(s) => {}}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
