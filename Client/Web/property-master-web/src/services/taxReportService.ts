import api from './api';

export interface TaxCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
  isTaxDeductible: boolean;
}

export interface TaxReport {
  propertyId: string;
  propertyName: string;
  taxYear: number;
  totalIncome: number;
  totalDeductibleExpenses: number;
  taxableIncome: number;
  incomeCategories: TaxCategory[];
  expenseCategories: TaxCategory[];
}

export interface YearlyTaxData {
  year: number;
  totalIncome: number;
  totalDeductibleExpenses: number;
  taxableIncome: number;
  yearOverYearIncomeChange: number;
  yearOverYearExpenseChange: number;
}

export interface MultiYearTaxComparison {
  propertyId: string;
  propertyName: string;
  yearlyData: YearlyTaxData[];
}

export interface TaxEstimationRequest {
  propertyId: string;
  taxYear: number;
  taxRate: number;
  additionalIncome: number;
  additionalDeductions: number;
}

export interface TaxEstimation {
  propertyId: string;
  propertyName: string;
  taxYear: number;
  currentTaxableIncome: number;
  estimatedTaxableIncome: number;
  taxRate: number;
  estimatedTaxLiability: number;
  additionalIncome: number;
  additionalDeductions: number;
  projectedSavings: number;
}

export interface TaxBracket {
  lowerBound: number;
  upperBound: number;
  rate: number;
}

export interface TaxBracketCalculationRequest {
  propertyId: string;
  taxYear: number;
  brackets: TaxBracket[];
  additionalIncome: number;
  additionalDeductions: number;
}

export interface TaxBracketBreakdown {
  lowerBound: number;
  upperBound: number;
  rate: number;
  incomeInBracket: number;
  taxForBracket: number;
}

export interface TaxBracketCalculation {
  propertyId: string;
  propertyName: string;
  taxYear: number;
  taxableIncome: number;
  estimatedTaxLiability: number;
  effectiveTaxRate: number;
  bracketBreakdown: TaxBracketBreakdown[];
}

const taxReportService = {
  getPropertyTaxReport: async (propertyId: string, taxYear: number): Promise<TaxReport> => {
    const response = await api.get(`/tax-reports/property/${propertyId}/${taxYear}`);
    return response.data;
  },

  getAllPropertiesTaxReport: async (taxYear: number): Promise<TaxReport[]> => {
    const response = await api.get(`/tax-reports/all-properties/${taxYear}`);
    return response.data;
  },

  getMultiYearTaxComparison: async (propertyId: string, startYear: number, endYear: number): Promise<MultiYearTaxComparison> => {
    const response = await api.get(`/tax-reports/property/${propertyId}/comparison?startYear=${startYear}&endYear=${endYear}`);
    return response.data;
  },
  estimateTaxes: async (request: TaxEstimationRequest): Promise<TaxEstimation> => {
    const response = await api.post('/tax-reports/estimate', request);
    return response.data;
  },
  calculateWithBrackets: async (request: TaxBracketCalculationRequest): Promise<TaxBracketCalculation> => {
    const response = await api.post('/tax-reports/calculate-with-brackets', request);
    return response.data;
  }  
};

export default taxReportService;