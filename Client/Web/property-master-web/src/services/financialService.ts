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
  ROI: number;
}

export interface MonthlyFinancialSummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  netOperatingIncome: number;
  cashFlow: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
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
    console.log("financialService.getFinancialReport called with propertyId:", propertyId, "startDate:", startDate, "endDate:", endDate);
    let url = `/financial/reports/property/${propertyId}`;
    
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    try {
      const response = await api.get(url);
      console.log("financialService.getFinancialReport - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getFinancialReport - Error:", error);
      throw error; // Re-throw the error to be handled in the component
    }
  },

  getCashFlowReport: async (propertyId: string, date?: string): Promise<CashFlowReport> => {
    console.log("financialService.getCashFlowReport called with propertyId:", propertyId, "date:", date);
    let url = `/financial/cashflow/property/${propertyId}`;
    
    if (date) {
      url += `?date=${date}`;
    }
    
    try {
      const response = await api.get(url);
      console.log("financialService.getCashFlowReport - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getCashFlowReport - Error:", error);
      throw error;
    }
  },

  getPropertyPerformance: async (propertyId: string): Promise<PropertyPerformance> => {
    console.log("financialService.getPropertyPerformance called with propertyId:", propertyId);
    try {
      const response = await api.get(`/financial/performance/property/${propertyId}`);
      console.log("financialService.getPropertyPerformance - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getPropertyPerformance - Error:", error);
      throw error;
    }
  },

  getPortfolioPerformance: async (userId: string): Promise<PropertyPerformance[]> => {
    console.log("financialService.getPortfolioPerformance called with userId:", userId);
    try {
      const response = await api.get(`/financial/performance/portfolio/${userId}`);
      console.log("financialService.getPortfolioPerformance - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getPortfolioPerformance - Error:", error);
      throw error;
    }
  },

  // NEW METHODS FOR GENERAL DASHBOARD DATA
  getGeneralFinancialReport: async (userId: string): Promise<FinancialReport[]> => {
    console.log("financialService.getGeneralFinancialReport called with userId:", userId);
    try {
      const response = await api.get(`/financial/reports/general/${userId}`);
      console.log("financialService.getGeneralFinancialReport - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getGeneralFinancialReport - Error:", error);
      throw error;
    }
  },

  getGeneralPropertyPerformance: async (userId: string): Promise<PropertyPerformance[]> => {
    console.log("financialService.getGeneralPropertyPerformance called with userId:", userId);
    try {
      const response = await api.get(`/financial/performance/general/${userId}`);
      console.log("financialService.getGeneralPropertyPerformance - Raw Response:", response);
      return response.data;
    } catch (error: any) {
      console.error("financialService.getGeneralPropertyPerformance - Error:", error);
      throw error;
    }
  },
};

export default financialService;