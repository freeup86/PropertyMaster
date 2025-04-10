import api from './api';

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlyFinancialSummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  netOperatingIncome: number;
  cashFlow: number;
}

export interface FinancialReport {
  propertyId: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;
  expenseRatio: number;
  incomeByCategory: CategorySummary[];
  expensesByCategory: CategorySummary[];
  monthlySummary: MonthlyFinancialSummary[];
}

export interface CashFlowReport {
  propertyId: string;
  propertyName: string;
  monthlyRentalIncome: number;
  otherMonthlyIncome: number;
  totalMonthlyIncome: number;
  vacancyLoss: number;
  propertyManagement: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  otherExpenses: number;
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  mortgagePayment: number;
  otherFinancingCosts: number;
  totalFinancingCosts: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  monthlyCashFlows: MonthlyFinancialSummary[];
}

export interface PropertyPerformance {
  propertyId: string;
  propertyName: string;
  purchasePrice: number;
  currentValue: number;
  appreciation: number;
  appreciationPercentage: number;
  totalCashInvested: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  totalReturn: number;
  annualizedReturn: number;
  expenseRatio: number;
  occupancyRate: number;
}

const financialService = {
  getFinancialReport: async (propertyId: string, startDate?: string, endDate?: string): Promise<FinancialReport> => {
    let url = `/financial/reports/property/${propertyId}`;
    
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getCashFlowReport: async (propertyId: string, date?: string): Promise<CashFlowReport> => {
    let url = `/financial/cashflow/property/${propertyId}`;
    
    if (date) {
      url += `?date=${date}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getPropertyPerformance: async (propertyId: string): Promise<PropertyPerformance> => {
    const response = await api.get(`/financial/performance/property/${propertyId}`);
    return response.data;
  },

  getPortfolioPerformance: async (userId: string): Promise<PropertyPerformance[]> => {
    const response = await api.get(`/financial/performance/portfolio/${userId}`);
    return response.data;
  },
};

export default financialService;