export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  tagIds?: string[];
  platform?: string;
  category?: string;
}

export interface ReportRequest {
  reportType: 'income_summary' | 'expense_breakdown' | 'tax_report';
  filters?: ReportFilters;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  entryCount: number;
}

export interface ReportData {
  reportType: string;
  generated_at: string;
  filters: ReportFilters;
  data: Record<string, unknown>;
  summary: ReportSummary;
}

export interface IncomeSummaryData {
  byPeriod: Array<{
    period: string;
    income: number;
    entries: number;
  }>;
  byPlatform: Array<{
    platform: string;
    income: number;
    entries: number;
  }>;
  byProperty?: Array<{
    propertyId: string;
    propertyName: string;
    income: number;
    entries: number;
  }>;
}

export interface ExpenseBreakdownData {
  byCategory: Array<{
    category: string;
    amount: number;
    entries: number;
  }>;
  byProperty?: Array<{
    propertyId: string;
    propertyName: string;
    amount: number;
    entries: number;
  }>;
  trends: Array<{
    period: string;
    amount: number;
  }>;
}

export interface TaxReportData {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeByMonth: Array<{
    month: string;
    income: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
}

export type ReportExportFormat = 'pdf' | 'csv' | 'excel';
