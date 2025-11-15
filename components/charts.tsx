import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from '../App';
import type { Transaction } from '../types';

const SPENDING_CHART_COLORS = ['#ef4444', '#f97316', '#eab308', '#8b5cf6', '#3b82f6', '#6366f1', '#ec4899', '#14b8a6', '#22c55e', '#64748b'];

interface SpendingPieChartProps {
    data: { name: string; value: number }[];
}

export const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ data }) => {
    const { theme } = useTheme();
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SPENDING_CHART_COLORS[index % SPENDING_CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: theme === 'dark' ? '#334155' : '#ffffff',
                        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
                        borderRadius: '0.5rem',
                    }}
                />
                <Legend iconSize={10} wrapperStyle={{fontSize: '0.875rem'}} />
            </PieChart>
        </ResponsiveContainer>
    );
};

interface SavingsTrendChartProps {
    data: Transaction[];
}

export const SavingsTrendChart: React.FC<SavingsTrendChartProps> = ({ data }) => {
    const { theme } = useTheme();
    // FIX: Explicitly type the accumulator in the reduce function to resolve 'unknown' type error for properties 'income' and 'expense'.
    const monthlyData = data.reduce<Record<string, { income: number, expense: number }>>((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) acc[month] = { income: 0, expense: 0 };
        if (t.type === 'income') acc[month].income += t.amount;
        if (t.type === 'expense') acc[month].expense += t.amount;
        return acc;
    }, {});
    
    const chartData = Object.entries(monthlyData).map(([name, values]) => ({
        name,
        savings: values.income - values.expense
    })).reverse();

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#ffffff', borderRadius: '0.5rem' }} />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};


interface CategorySpendingChartProps {
    data: { name: string; spent: number; allocated: number }[];
}

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({ data }) => {
    const { theme } = useTheme();
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                <XAxis type="number" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis type="category" dataKey="name" width={80} stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#ffffff', borderRadius: '0.5rem' }} />
                <Legend />
                <Bar dataKey="spent" stackId="a" fill="#ef4444" name="Spent" />
                <Bar dataKey="allocated" stackId="a" fill="#22c55e" name="Budgeted" />
            </BarChart>
        </ResponsiveContainer>
    );
};