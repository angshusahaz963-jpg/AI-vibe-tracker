
import React, { useState, useEffect, useMemo } from 'react';
import { useBudget } from '../App';
import { CATEGORIES } from '../constants';
import { Card } from './common';

const Planner: React.FC = () => {
    const { budgets: initialBudgets, updateBudgets, totalIncome } = useBudget();
    const [localBudgets, setLocalBudgets] = useState(initialBudgets);

    const totalAllocated = useMemo(() => localBudgets.reduce((sum, b) => sum + b.allocated, 0), [localBudgets]);
    const remainingToAllocate = totalIncome - totalAllocated;

    useEffect(() => {
        setLocalBudgets(initialBudgets);
    }, [initialBudgets]);

    const handleBudgetChange = (category: string, value: number) => {
        setLocalBudgets(prev => prev.map(b => b.category === category ? { ...b, allocated: value } : b));
    };

    const handleSaveChanges = () => {
        updateBudgets(localBudgets);
        alert('Budget saved!'); // In a real app, use a less intrusive notification
    };
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card className="sticky top-16 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <div>
                        <h2 className="text-lg font-semibold">Remaining to Allocate:</h2>
                        <p className={`text-2xl font-bold ${remainingToAllocate >= 0 ? 'text-success-500' : 'text-danger-500'}`}>{formatCurrency(remainingToAllocate)}</p>
                    </div>
                    <button onClick={handleSaveChanges} className="w-full sm:w-auto bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </Card>

            <Card>
                <div className="space-y-6">
                    {localBudgets.map(budget => {
                        const categoryInfo = CATEGORIES[budget.category];
                        return (
                            <div key={budget.category}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-3">
                                        {categoryInfo && <categoryInfo.icon className="w-6 h-6 text-slate-500 dark:text-slate-400" />}
                                        <span className="font-semibold text-lg">{categoryInfo?.name || budget.category}</span>
                                    </div>
                                    <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{formatCurrency(budget.allocated)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={totalIncome}
                                    step="10"
                                    value={budget.allocated}
                                    onChange={e => handleBudgetChange(budget.category, parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default Planner;
