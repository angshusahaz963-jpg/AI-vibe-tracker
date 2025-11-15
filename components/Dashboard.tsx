
import React from 'react';
import { useBudget } from '../App';
import type { TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { Card, ProgressBar } from './common';
import { SpendingPieChart } from './charts';

interface DashboardProps {
  openTransactionModal: (type: TransactionType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ openTransactionModal }) => {
  const { transactions, budgets, totalIncome, totalExpenses, savings } = useBudget();

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(categorySpending).map(([name, value]) => ({
    name: CATEGORIES[name]?.name || name,
    value,
  }));

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-success-400 to-success-600 text-white">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-danger-400 to-danger-600 text-white">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
          <h3 className="text-lg font-semibold">Savings</h3>
          <p className="text-3xl font-bold">{formatCurrency(savings)}</p>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <div className="flex justify-around">
          <button onClick={() => openTransactionModal('income')} className="flex-1 text-center py-2 px-4 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors mr-2">
            Add Income
          </button>
          <button onClick={() => openTransactionModal('expense')} className="flex-1 text-center py-2 px-4 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors ml-2">
            Add Expense
          </button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown */}
        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Spending Breakdown</h3>
          {pieChartData.length > 0 ? <SpendingPieChart data={pieChartData} /> : <p className="text-center text-slate-500 dark:text-slate-400 py-10">No expenses recorded yet.</p>}
        </Card>

        {/* Budget Goals */}
        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Budget Goals</h3>
          <div className="space-y-4">
            {budgets.map(budget => {
              const spent = categorySpending[budget.category] || 0;
              const progress = budget.allocated > 0 ? (spent / budget.allocated) * 100 : 0;
              const categoryInfo = CATEGORIES[budget.category];
              return (
                <div key={budget.category}>
                  <div className="flex justify-between mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <span>{categoryInfo?.name || budget.category}</span>
                    <span>{formatCurrency(spent)} / {formatCurrency(budget.allocated)}</span>
                  </div>
                  <ProgressBar value={progress} colorClass={categoryInfo?.color || 'bg-gray-500'} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
