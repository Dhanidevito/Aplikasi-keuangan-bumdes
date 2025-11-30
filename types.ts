export type TransactionType = 'INCOME' | 'EXPENSE';

export interface BusinessUnit {
  id: string;
  name: string;
  description: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  unitId: string; // Refers to BusinessUnit
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactionCount: number;
}

export enum PageView {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  AI_ADVISOR = 'AI_ADVISOR',
}
