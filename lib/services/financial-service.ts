import { Transaction, FinancialStats } from '@/lib/types/financial';
import { PaginationParams } from '@/lib/types/common';
import { apiClient } from '@/lib/api/api-client';

/**
 * Map response BE KasHarian ke tipe Transaction FE.
 * BE: { id, tanggal, jenis (PEMASUKAN/PENGELUARAN), kategori, keterangan, nominal, buktiUrl }
 * FE: { id, date, type (pemasukan/pengeluaran), category, description, amount, createdAt }
 */
function mapKasToTransaction(raw: any): Transaction {
  return {
    id: String(raw.id),
    date: raw.tanggal ? new Date(raw.tanggal) : new Date(raw.createdAt),
    type: raw.jenis === 'PEMASUKAN' ? 'pemasukan' : 'pengeluaran',
    category: raw.kategori || '',
    description: raw.keterangan || '',
    amount: raw.nominal || 0,
    reference: raw.buktiUrl || undefined,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(raw.tanggal),
  };
}

/**
 * Nama bulan dalam Bahasa Indonesia
 */
function getBulanName(bulan: number): string {
  const bulanNames = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return bulanNames[bulan] || String(bulan);
}

export const financialService = {
  // Fetch all transactions / Buku Kas
  // BE: { riwayat: [...], totalSaldoAkhir, totalItem }
  async getTransactions(params: PaginationParams): Promise<any> {
    const rawData = await apiClient(`/kas/buku-kas?page=${params.page}&limit=${params.limit}`);
    const riwayat = (rawData.riwayat || []).map(mapKasToTransaction);
    const total = rawData.totalItem || 0;

    return {
      data: riwayat,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit) || 1,
      totalSaldoAkhir: rawData.totalSaldoAkhir || 0
    };
  },

  /**
   * Fetch tunggakan warga untuk admin/bendahara.
   * BE return: { data: [{ warga, jumlahBulanTunggakan, totalNominalTunggakan, detailTagihan }], total }
   * Data sudah dikelompokkan per warga.
   */
  async getInvoices(params: PaginationParams): Promise<any> {
    try {
      const rawData = await apiClient(`/tagihan/tunggakan?page=${params.page}&limit=${params.limit}`);
      // BE return { data: [...grouped], total }
      const dataArray = Array.isArray(rawData.data) ? rawData.data : [];
      const total = rawData.total || 0;

      return {
        data: dataArray,
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit) || 1
      };
    } catch {
      return { data: [], total: 0, page: 1, limit: params.limit, totalPages: 0 };
    }
  },

  /**
   * Get tagihan pribadi untuk warga yang login.
   * BE: GET /tagihan/me → array Tagihan[]
   * Setiap item: { id, wargaId, bulan (int), tahun (int), totalNominal, status, pembayaran[] }
   * Kita tambahkan field helper: bulanNama, nominalFormatted
   */
  async getMyInvoices(): Promise<any> {
    const data = await apiClient('/tagihan/me');
    // data adalah array tagihan
    const arr = Array.isArray(data) ? data : [];
    return arr.map((t: any) => ({
      ...t,
      nominal: t.totalNominal,               // alias untuk kemudahan FE
      bulanNama: getBulanName(t.bulan),       // "April", "Maret", dll
      periodeTeks: `${getBulanName(t.bulan)} ${t.tahun}`,
    }));
  },

  // Fetch single invoice
  async getInvoice(id: string): Promise<any> {
    try {
      const data = await apiClient(`/tagihan/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  // Generate Tagihan Otomatis Bulanan
  async createInvoice(bulan: number, tahun: number): Promise<any> {
    const data = await apiClient('/tagihan/generate', {
      method: 'POST',
      data: { bulan, tahun },
    });
    return data;
  },

  // Create Iuran Master
  async createIuranMaster(input: { nama: string; nominal: number; periode?: string }): Promise<any> {
    const data = await apiClient('/tagihan/iuran-master', {
      method: 'POST',
      data: input,
    });
    return data;
  },

  // Get Iuran Master (Referensi Iuran)
  async getIuranMaster(): Promise<any[]> {
    try {
      const data = await apiClient('/tagihan/iuran-master');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  // Record Kas Harian (Pemasukan / Pengeluaran)
  async recordKas(input: {
    jenis: 'PEMASUKAN' | 'PENGELUARAN';
    kategori: string;
    keterangan: string;
    nominal: number;
    buktiUrl?: string;
  }): Promise<any> {
    const data = await apiClient('/kas/record', {
      method: 'POST',
      data: input,
    });
    return data;
  },

  // Fetch financial statistics
  // BE: { totalPemasukan, totalPengeluaran, saldo, invoicesTunggakan, invoicesBaru, invoicesLunas }
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

  // Export Laporan Tahunan PDF
  async exportLaporanTahunan(tahun: string): Promise<any> {
    const data = await apiClient(`/kas/laporan-tahunan/${tahun}`);
    return data;
  },
};
