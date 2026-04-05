// Phone number validation (Indonesian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^(\+62|0)?[0-9]{9,12}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// KK Number validation (16 digits)
export const isValidKKNumber = (kkNumber: string): boolean => {
  return /^\d{16}$/.test(kkNumber.replace(/\s/g, ''));
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 100;
};

// House number validation
export const isValidHouseNumber = (number: string): boolean => {
  return number.trim().length > 0 && number.trim().length <= 20;
};

// Amount validation
export const isValidAmount = (amount: number): boolean => {
  return amount > 0;
};

// Validate required fields
export const isFieldEmpty = (value: string | number | undefined | null): boolean => {
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return value <= 0;
  return value === undefined || value === null;
};

// Get validation error message
export const getValidationError = (field: string, type: string): string => {
  const errors: Record<string, Record<string, string>> = {
    phone: {
      invalid: 'Nomor telepon tidak valid. Format: +62xxxx atau 0xxxx',
      required: 'Nomor telepon wajib diisi',
    },
    email: {
      invalid: 'Email tidak valid',
      required: 'Email wajib diisi',
    },
    kkNumber: {
      invalid: 'Nomor KK harus 16 digit',
      required: 'Nomor KK wajib diisi',
    },
    password: {
      invalid: 'Password minimal 6 karakter',
      required: 'Password wajib diisi',
    },
    name: {
      invalid: 'Nama harus 3-100 karakter',
      required: 'Nama wajib diisi',
    },
  };

  return errors[field]?.[type] || `${field} tidak valid`;
};
