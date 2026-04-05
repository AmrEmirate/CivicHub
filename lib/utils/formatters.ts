// Currency formatter (Indonesian Rupiah)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Date formatter (Indonesian format)
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Date with time
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Phone number formatter (Indonesian)
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+62' + cleaned.substring(1);
  }
  return '+62' + cleaned;
};

// Shorten text
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Format invoice number
export const formatInvoiceNumber = (invoiceId: string, invoiceIndex: number): string => {
  return `INV-${new Date().getFullYear()}-${String(invoiceIndex).padStart(4, '0')}`;
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};
