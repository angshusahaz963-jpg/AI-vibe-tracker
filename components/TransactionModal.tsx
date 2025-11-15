
import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionType } from '../types';
import { useBudget } from '../App';
import { CATEGORIES } from '../constants';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: TransactionType;
    transactionToEdit?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type, transactionToEdit }) => {
    const { addTransaction, updateTransaction } = useBudget();
    
    const getInitialState = () => ({
        type: transactionToEdit?.type || type,
        category: transactionToEdit?.category || (type === 'expense' ? 'food' : 'salary'),
        amount: transactionToEdit?.amount || 0,
        date: transactionToEdit?.date || new Date().toISOString().split('T')[0],
        description: transactionToEdit?.description || '',
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        setFormData(getInitialState());
    }, [isOpen, transactionToEdit, type]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (transactionToEdit) {
            updateTransaction({ ...formData, id: transactionToEdit.id });
        } else {
            addTransaction(formData);
        }
        onClose();
    };

    const incomeCategories = [{id: 'salary', name: 'Salary'}, {id: 'freelance', name: 'Freelance'}, {id: 'investment', name: 'Investment'}, {id: 'other', name: 'Other'}];
    const expenseCategories = Object.values(CATEGORIES);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md animate-slide-in-up">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{transactionToEdit ? 'Edit' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700">{transactionToEdit ? 'Save Changes' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
