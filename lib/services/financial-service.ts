import { Transaction, Invoice, Payment, FinancialStats, CreateInvoiceInput, RecordPaymentInput } from '@/lib/types/financial';
import { mockTransactions, mockInvoices, mockPayments, mockFinancialStats } from '@/lib/mock-data/financial';
import { PaginationParams } from '@/lib/types/common';

// This service layer is prepared for API integration
// Replace mock data calls with actual API calls when backend is ready

export const financialService = {
  // Fetch all transactions
  async getTransactions(params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: mockTransactions.slice(startIndex, endIndex),
      total: mockTransactions.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(mockTransactions.length / params.limit),
    };
  },

  // Fetch all invoices
  async getInvoices(params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: mockInvoices.slice(startIndex, endIndex),
      total: mockInvoices.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(mockInvoices.length / params.limit),
    };
  },

  // Fetch single invoice
  async getInvoice(id: string): Promise<Invoice | null> {
    // TODO: Replace with API call
    return mockInvoices.find(i => i.id === id) || null;
  },

  // Create new invoice
  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    // TODO: Replace with API call
    const newInvoice: Invoice = {
      id: String(mockInvoices.length + 1),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(4, '0')}`,
      memberId: input.memberId,
      memberName: 'Member Name', // Get from API
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      items: input.items.map((item, index) => ({
        ...item,
        id: `item-${Date.now()}-${index}`,
      })),
      totalAmount: input.items.reduce((sum, item) => sum + item.amount, 0),
      paidAmount: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  // Record payment for invoice
  async recordPayment(input: RecordPaymentInput): Promise<Payment> {
    // TODO: Replace with API call
    const newPayment: Payment = {
      id: String(mockPayments.length + 1),
      invoiceId: input.invoiceId,
      memberId: '', // Get from invoice
      amount: input.amount,
      paymentDate: input.paymentDate,
      paymentMethod: input.paymentMethod,
      reference: input.reference,
      notes: input.notes,
      createdAt: new Date(),
    };

    mockPayments.push(newPayment);

    // Update invoice status
    const invoice = mockInvoices.find(i => i.id === input.invoiceId);
    if (invoice) {
      invoice.paidAmount += input.amount;
      if (invoice.paidAmount >= invoice.totalAmount) {
        invoice.status = 'lunas';
      }
      invoice.updatedAt = new Date();
    }

    return newPayment;
  },

  // Fetch all payments
  async getPayments(params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: mockPayments.slice(startIndex, endIndex),
      total: mockPayments.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(mockPayments.length / params.limit),
    };
  },

  // Fetch financial statistics
  async getFinancialStats(): Promise<FinancialStats> {
    // TODO: Replace with API call
    return mockFinancialStats;
  },

  // Fetch transaction by type
  async getTransactionsByType(type: 'pemasukan' | 'pengeluaran', params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const filtered = mockTransactions.filter(t => t.type === type);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(filtered.length / params.limit),
    };
  },

  // Delete invoice
  async deleteInvoice(id: string): Promise<void> {
    // TODO: Replace with API call
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index > -1) {
      mockInvoices.splice(index, 1);
    }
  },

  // Update invoice
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    // TODO: Replace with API call
    const invoice = mockInvoices.find(i => i.id === id);
    if (!invoice) throw new Error('Invoice not found');

    Object.assign(invoice, updates, { updatedAt: new Date() });
    return invoice;
  },
};
