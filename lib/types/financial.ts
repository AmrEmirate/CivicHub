import { PaginatedResponse } from './common';

export type TransactionType = 'pemasukan' | 'pengeluaran';
export type InvoiceStatus = 'lunas' | 'tunggakan' | 'pending';
export type PaymentMethod = 'tunai' | 'transfer_bank' | 'qris' | 'cek';

export interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  reference?: string;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  memberId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference: string;
  notes?: string;
  createdAt: Date;
}

export interface FinancialStats {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  invoicesTunggakan: number;
  invoicesBaru: number;
  invoicesLunas: number;
}

export interface FinancialSummary {
  date: Date;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
}

export interface CreateInvoiceInput {
  memberId: string;
  issueDate: Date;
  dueDate: Date;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
}

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference: string;
  notes?: string;
}

export interface TransactionsResponse extends PaginatedResponse<Transaction> {}
export interface InvoicesResponse extends PaginatedResponse<Invoice> {}
export interface PaymentsResponse extends PaginatedResponse<Payment> {}
