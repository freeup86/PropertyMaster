import api from './api';

export enum TransactionType {
  Income = 0,
  Expense = 1,
  Investment = 2,
  Transfer = 3
}

export enum RecurrencePattern {
  Daily = 0,
  Weekly = 1,
  Biweekly = 2,
  Monthly = 3,
  Quarterly = 4,
  Annually = 5
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitNumber?: string;
  categoryId: string;
  categoryName: string;
  categoryType: string;
  accountId?: string;
  accountName?: string;
  type: TransactionType;
  date: string;
  amount: number;
  description: string;
  notes: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  nextDueDate?: string;
  isTaxDeductible: boolean;
  isPaid: boolean;
  paidDate?: string;
}

export interface CreateTransactionRequest {
  propertyId: string;
  unitId?: string;
  categoryId: string;
  accountId?: string;
  type: TransactionType;
  date: string;
  amount: number;
  description: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  nextDueDate?: string;
  isTaxDeductible: boolean;
  isPaid: boolean;
  paidDate?: string;
}

export interface UpdateTransactionRequest {
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  date?: string;
  amount?: number;
  description?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  nextDueDate?: string;
  isTaxDeductible?: boolean;
  isPaid?: boolean;
  paidDate?: string;
}

const transactionService = {
  getTransactionsByProperty: async (propertyId: string, startDate?: string, endDate?: string): Promise<Transaction[]> => {
    let url = `/transactions/property/${propertyId}`;
    
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getTransactionsByUnit: async (unitId: string, startDate?: string, endDate?: string): Promise<Transaction[]> => {
    let url = `/transactions/unit/${unitId}`;
    
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (transaction: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  updateTransaction: async (id: string, transaction: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;