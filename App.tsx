
import React, { useState, useMemo, useCallback, useEffect, createContext, useContext } from 'react';
import type { Transaction, Budget, View, TransactionType } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from './constants';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Tracker from './components/Tracker';
import Analytics from './components/Analytics';
import { Layout } from './components/common';
import TransactionModal from './components/TransactionModal';

// THEME MANAGEMENT
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// BUDGET & TRANSACTION MANAGEMENT
interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateBudgets: (budgets: Budget[]) => void;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};


const BudgetProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
    const [notification, setNotification] = useState<string | null>(null);

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: new Date().toISOString() };
        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (newTransaction.type === 'expense') {
            const budget = budgets.find(b => b.category === newTransaction.category);
            if (budget) {
                const expensesForCategory = transactions
                    .filter(t => t.type === 'expense' && t.category === newTransaction.category)
                    .reduce((sum, t) => sum + t.amount, 0) + newTransaction.amount;
                
                if (expensesForCategory / budget.allocated >= 0.8 && expensesForCategory <= budget.allocated) {
                    setNotification(`You've spent over 80% of your ${newTransaction.category} budget!`);
                } else if (expensesForCategory > budget.allocated) {
                    setNotification(`Warning: You've gone over your ${newTransaction.category} budget!`);
                }
            }
        }
    }, [transactions, budgets]);
    
    useEffect(() => {
        if(notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const updateTransaction = useCallback((updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }, []);

    const deleteTransaction = useCallback((id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const updateBudgets = (newBudgets: Budget[]) => {
        setBudgets(newBudgets);
    };

    const { totalIncome, totalExpenses, savings } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, savings: income - expenses };
    }, [transactions]);
    
    return (
        <BudgetContext.Provider value={{ transactions, budgets, addTransaction, updateTransaction, deleteTransaction, updateBudgets, totalIncome, totalExpenses, savings }}>
             {children}
             {notification && (
                <div className="fixed bottom-20 sm:bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in">
                    {notification}
                </div>
            )}
        </BudgetContext.Provider>
    );
};


// MAIN APP COMPONENT
export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: TransactionType; transaction?: Transaction }>({ type: 'expense' });

  const openTransactionModal = (type: TransactionType, transaction?: Transaction) => {
    setModalConfig({ type, transaction });
    setIsModalOpen(true);
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard openTransactionModal={openTransactionModal} />;
      case 'planner':
        return <Planner />;
      case 'tracker':
        return <Tracker openTransactionModal={openTransactionModal} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard openTransactionModal={openTransactionModal} />;
    }
  };

  return (
    <ThemeProvider>
        <BudgetProvider>
            <Layout currentView={view} setView={setView}>
                <div className="p-4 pb-24 sm:pb-4">
                     {renderView()}
                </div>
                <TransactionModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    type={modalConfig.type}
                    transactionToEdit={modalConfig.transaction}
                />
            </Layout>
        </BudgetProvider>
    </ThemeProvider>
  );
}
