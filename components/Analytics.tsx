
import React, { useMemo } from 'react';
import { useBudget } from '../App';
import { CATEGORIES } from '../constants';
import { Card } from './common';
import { SavingsTrendChart, CategorySpendingChart } from './charts';

const Analytics: React.FC = () => {
    const { transactions, budgets } = useBudget();

    const categorySpendingData = useMemo(() => {
        const spentByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        return budgets.map(b => ({
            name: CATEGORIES[b.category]?.name || b.category,
            spent: spentByCategory[b.category] || 0,
            allocated: b.allocated,
        }));
    }, [transactions, budgets]);

    const spendingHeatmapData = useMemo(() => {
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const dailySpending: Record<number, number> = {};

        for (const transaction of transactions) {
            if (transaction.type === 'expense' && new Date(transaction.date).getMonth() === new Date().getMonth()) {
                const day = new Date(transaction.date).getDate();
                dailySpending[day] = (dailySpending[day] || 0) + transaction.amount;
            }
        }

        const maxSpending = Math.max(...Object.values(dailySpending), 1);
        
        const heatmap = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const spending = dailySpending[day] || 0;
            const intensity = Math.min(Math.floor((spending / maxSpending) * 5), 4);
            heatmap.push({ day, intensity });
        }
        return heatmap;
    }, [transactions]);
    
    const intensityColors = [
        'bg-slate-200 dark:bg-slate-700', // 0
        'bg-success-200 dark:bg-success-800', // 1
        'bg-success-300 dark:bg-success-700', // 2
        'bg-yellow-400 dark:bg-yellow-600', // 3
        'bg-danger-500 dark:bg-danger-600', // 4
    ];

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <h2 className="text-xl font-bold mb-4">Monthly Savings Trend</h2>
                <SavingsTrendChart data={transactions} />
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">Category Spending Comparison</h2>
                <CategorySpendingChart data={categorySpendingData} />
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">Daily Spending Heatmap (Current Month)</h2>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                         <div key={day} className="text-center font-semibold text-xs text-slate-500 dark:text-slate-400">{day}</div>
                    ))}
                    {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {spendingHeatmapData.map(({ day, intensity }) => (
                        <div key={day} className={`w-full aspect-square rounded ${intensityColors[intensity]} flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200`}>
                           {day}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
