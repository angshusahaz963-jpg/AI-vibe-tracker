import type { FC } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Budget {
  category: string;
  allocated: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  // FIX: Cannot find namespace 'React'. Importing FC type from react to fix this.
  icon: FC<{ className?: string }>;
}

export type View = 'dashboard' | 'planner' | 'tracker' | 'analytics';