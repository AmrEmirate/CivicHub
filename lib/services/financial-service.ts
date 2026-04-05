import { Transaction, Invoice, Payment, FinancialStats, CreateInvoiceInput, RecordPaymentInput } from '@/lib/types/financial';
import { PaginationParams } from '@/lib/types/common';
import { apiClient } from '@/lib/api/api-client';

export const financialService = {
  // Fetch all transactions / Buku Kas
  async getTransactions(params: PaginationParams): Promise<any> {
    const rawData = await apiClient(`/kas/buku-kas`);
    const riwayat = rawData.riwayat || [];
    
    // Simulate pagination locally
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedData = riwayat.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: riwayat.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(riwayat.length / params.limit),
      totalSaldoAkhir: rawData.totalSaldoAkhir || 0
    };
  },

  // Fetch all invoices / Tunggakan atau Tagihan
  // Kita gunakan tunggakan sebagai default list untuk admin
  async getInvoices(params: PaginationParams): Promise<any> {
    try {
      const rawData = await apiClient(`/tagihan/tunggakan`);
      const dataArray = Array.isArray(rawData) ? rawData : [];

      // Simulate pagination locally
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      const paginatedData = dataArray.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: dataArray.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(dataArray.length / params.limit)
      };
    } catch {
      return { data: [], total: 0, page: 1, limit: params.limit, totalPages: 0 };
    }
  },

  // Get personal tagihan bagi warga
  async getMyInvoices(): Promise<any> {
    const data = await apiClient('/tagihan/me');
    return data;
  },

  // Fetch single invoice
  async getInvoice(id: string): Promise<Invoice | null> {
    try {
      // Endpoint ini mungkin tidak ada di BE, kita asumsikan /tagihan/:id
      const data = await apiClient(`/tagihan/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  // Create new invoice (Generate Tagihan Otomatis)
  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    const issueDate = new Date(input.issueDate);
    const data = await apiClient('/tagihan/generate', {
      method: 'POST',
      data: {
        bulan: issueDate.getMonth() + 1,
        tahun: issueDate.getFullYear()
      },
    });
    return data;
  },

  // Create Iuran Master (Fitur 2: Manajemen Iuran Wajib)
  async createIuranMaster(input: any): Promise<any> {
    const data = await apiClient('/tagihan/iuran-master', {
      method: 'POST',
      data: input,
    });
    return data;
  },

  // Record payment / Kas (Untuk Kas Harian)
  async recordPayment(input: RecordPaymentInput): Promise<Payment> {
    const data = await apiClient('/kas/record', {
      method: 'POST',
      data: {
        jenis: 'PEMASUKAN',
        kategori: 'PEMBAYARAN_MANUAL',
        keterangan: input.notes || `Pembayaran Invoice ${input.invoiceId}`,
        nominal: input.amount,
      },
    });
    return data;
  },

  // Initiate Payment / Integrasi Pembayaran Digital (Midtrans dll)
  async initiatePayment(payload: any): Promise<any> {
    const data = await apiClient('/payment/initiate', {
      method: 'POST',
      data: payload,
    });
    return data;
  },

  // Fetch all payments (opsional, bisa diambil dari transaksi tipe pemasukan)
  async getPayments(params: PaginationParams): Promise<any> {
    const data = await apiClient(`/kas/buku-kas?type=pemasukan&page=${params.page}&limit=${params.limit}`);
    return data;
  },

  // Fetch financial statistics
  async getFinancialStats(): Promise<FinancialStats> {
    try {
      const data = await apiClient('/kas/stats');
      return data;
    } catch {
      return {
        totalPemasukan: 0,
        totalPengeluaran: 0,
        saldo: 0,
        invoicesTunggakan: 0,
        invoicesBaru: 0,
        invoicesLunas: 0,
      };
    }
  },

  // Fetch transaction by type
  async getTransactionsByType(type: 'pemasukan' | 'pengeluaran', params: PaginationParams): Promise<any> {
    const data = await apiClient(`/kas/buku-kas?type=${type}&page=${params.page}&limit=${params.limit}`);
    return data;
  },

  // Export Laporan Tahunan
  async exportLaporanTahunan(tahun: string): Promise<any> {
    const data = await apiClient(`/kas/laporan-tahunan/${tahun}`);
    return data;
  },

  // Delete invoice (Jika ada implementasi)
  async deleteInvoice(id: string): Promise<void> {
    await apiClient(`/tagihan/${id}`, { method: 'DELETE' });
  },

  // Update invoice (Jika ada implementasi)
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const data = await apiClient(`/tagihan/${id}`, {
      method: 'PUT',
      data: updates,
    });
    return data;
  },
};
