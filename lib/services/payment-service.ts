import { apiClient } from '@/lib/api/api-client';

export const paymentService = {
  async initiate(tagihanId: number, metode: string = 'SNAP'): Promise<{ checkoutUrl: string }> {
    return apiClient('/payment/initiate', {
      method: 'POST',
      data: { tagihanId, metode }
    });
  }
};
