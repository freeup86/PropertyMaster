import api from './api';
import categoryService, { Category } from './categoryService';
// --- Add AxiosError import ---
import { AxiosError } from 'axios';
// --- End of added import ---


// ... (enums, interfaces, other service methods like createRentTransaction) ...
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
    transactionCategory?: string;
    subCategory?: string;
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
    transactionCategory: string;
    subCategory: string;
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
    transactionCategory?: string;
    subCategory?: string;
  }


const transactionService = {
 // ... createRentTransaction method ...
 createRentTransaction: async (
    propertyId: string,
    unitId: string,
    amount: number,
    tenantName: string
  ): Promise<Transaction> => {
    const categories: Category[] = await categoryService.getCategories();
    const rentCategory = categories.find(
      (c) => c.type === "Income" && c.name.toLowerCase().includes("rent")
    );

    if (!rentCategory) {
      throw new Error("Rent income category not found. Cannot record transaction.");
    }

    const transactionData: CreateTransactionRequest = {
      propertyId,
      unitId,
      categoryId: rentCategory.id,
      type: TransactionType.Income,
      date: new Date().toISOString(),
      amount,
      description: `Rent payment for ${tenantName}`,
      notes: "",
      isRecurring: false,
      isTaxDeductible: false,
      isPaid: true,
      paidDate: new Date().toISOString(),
      transactionCategory: "Income",
      subCategory: "Rent",
    };

    return transactionService.createTransaction(transactionData);
  },


  createTransaction: async (transaction: CreateTransactionRequest): Promise<Transaction> => {
    try {
       const response = await api.post('/transactions', transaction);
       return response.data;
    } catch (error) {
       // --- Updated catch block ---
       if (error instanceof AxiosError && error.response) {
         // Now TypeScript knows error is AxiosError and has a response
         console.error("Failed to create transaction (API Error):", error.response.data);
       } else if (error instanceof Error) {
         // Handle non-Axios errors that are still Error objects
         console.error("Failed to create transaction (Error):", error.message);
       } else {
         // Handle cases where something else was thrown (e.g., a string)
         console.error("Failed to create transaction (Unknown):", error);
       }
       // --- End of updated catch block ---
       throw error; // Re-throw the original error to be handled by the caller
    }
  },

  // ... (rest of transactionService methods) ...
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

  updateTransaction: async (id: string, transaction: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

};

export default transactionService;