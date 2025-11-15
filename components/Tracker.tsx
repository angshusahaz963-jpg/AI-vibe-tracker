
import React, { useState, useMemo } from 'react';
import { useBudget } from '../App';
import type { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { Card } from './common';

interface TrackerProps {
    openTransactionModal: (type: TransactionType, transaction: Transaction) => void;
}

const Tracker: React.FC<TrackerProps> = ({ openTransactionModal }) => {
    const { transactions, deleteTransaction } = useBudget();
    const [filter, setFilter] = useState<{ category: string; type: string; searchTerm: string }>({
        category: 'all',
        type: 'all',
        searchTerm: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const categoryMatch = filter.category === 'all' || t.category === filter.category;
            const typeMatch = filter.type === 'all' || t.type === filter.type;
            const searchMatch = t.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
            return categoryMatch && typeMatch && searchMatch;
        });
    }, [transactions, filter]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="searchTerm"
                        placeholder="Search descriptions..."
                        value={filter.searchTerm}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <select
                        name="type"
                        value={filter.type}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <select
                        name="category"
                        value={filter.category}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {Object.values(CATEGORIES).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </Card>
            <Card>
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredTransactions.map(t => {
                        const categoryInfo = CATEGORIES[t.category];
                        return (
                            <li key={t.id} className="py-4 flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo?.color || 'bg-gray-500'}`}>
                                        {categoryInfo?.icon && <categoryInfo.icon className="w-5 h-5 text-white" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{t.description}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{categoryInfo?.name || t.category} &bull; {formatDate(t.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className={`font-bold ${t.type === 'income' ? 'text-success-500' : 'text-danger-500'}`}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </p>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                                        <button onClick={() => openTransactionModal(t.type, t)} className="p-2 text-slate-500 hover:text-primary-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => deleteTransaction(t.id)} className="p-2 text-slate-500 hover:text-danger-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                 {filteredTransactions.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-10">No transactions match your filters.</p>}
            </Card>
        </div>
    );
};

export default Tracker;
