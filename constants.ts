
import type { Category, Transaction, Budget } from './types';
import { HomeIcon, ShoppingCartIcon, UtensilsIcon, ClapperboardIcon, CarIcon, GraduationCapIcon, HeartPulseIcon, PlaneIcon, GiftIcon, HelpCircleIcon } from './components/common';

export const CATEGORIES: { [key: string]: Category } = {
  rent: { id: 'rent', name: 'Rent', color: 'bg-red-500', icon: HomeIcon },
  food: { id: 'food', name: 'Food', color: 'bg-orange-500', icon: UtensilsIcon },
  groceries: { id: 'groceries', name: 'Groceries', color: 'bg-yellow-500', icon: ShoppingCartIcon },
  entertainment: { id: 'entertainment', name: 'Entertainment', color: 'bg-purple-500', icon: ClapperboardIcon },
  transport: { id: 'transport', name: 'Transport', color: 'bg-blue-500', icon: CarIcon },
  education: { id: 'education', name: 'Education', color: 'bg-indigo-500', icon: GraduationCapIcon },
  health: { id: 'health', name: 'Health', color: 'bg-pink-500', icon: HeartPulseIcon },
  travel: { id: 'travel', name: 'Travel', color: 'bg-teal-500', icon: PlaneIcon },
  gifts: { id: 'gifts', name: 'Gifts', color: 'bg-green-500', icon: GiftIcon },
  other: { id: 'other', name: 'Other', color: 'bg-gray-500', icon: HelpCircleIcon },
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', category: 'salary', amount: 5000, date: new Date(new Date().setDate(1)).toISOString().split('T')[0], description: 'Monthly Salary' },
  { id: '2', type: 'expense', category: 'rent', amount: 1500, date: new Date(new Date().setDate(2)).toISOString().split('T')[0], description: 'Apartment Rent' },
  { id: '3', type: 'expense', category: 'groceries', amount: 350, date: new Date(new Date().setDate(3)).toISOString().split('T')[0], description: 'Weekly Groceries' },
  { id: '4', type: 'expense', category: 'food', amount: 75, date: new Date(new Date().setDate(5)).toISOString().split('T')[0], description: 'Dinner with friends' },
  { id: '5', type: 'expense', category: 'transport', amount: 50, date: new Date(new Date().setDate(6)).toISOString().split('T')[0], description: 'Gasoline' },
  { id: '6', type: 'expense', category: 'entertainment', amount: 120, date: new Date(new Date().setDate(8)).toISOString().split('T')[0], description: 'Concert tickets' },
  { id: '7', type: 'expense', category: 'health', amount: 45, date: new Date(new Date().setDate(10)).toISOString().split('T')[0], description: 'Pharmacy' },
  { id: '8', type: 'expense', category: 'groceries', amount: 150, date: new Date(new Date().setDate(12)).toISOString().split('T')[0], description: 'Costco run' },
  { id: '9', type: 'expense', category: 'food', amount: 30, date: new Date(new Date().setDate(15)).toISOString().split('T')[0], description: 'Lunch' },
  { id: '10', type: 'income', category: 'freelance', amount: 750, date: new Date(new Date().setDate(16)).toISOString().split('T')[0], description: 'Web Design Project' },
  { id: '11', type: 'expense', category: 'other', amount: 200, date: new Date(new Date().setDate(18)).toISOString().split('T')[0], description: 'New headphones' },
  { id: '12', type: 'expense', category: 'gifts', amount: 50, date: new Date(new Date().setDate(22)).toISOString().split('T')[0], description: "Friend's birthday gift" },
];

export const INITIAL_BUDGETS: Budget[] = [
  { category: 'rent', allocated: 1500 },
  { category: 'food', allocated: 400 },
  { category: 'groceries', allocated: 600 },
  { category: 'entertainment', allocated: 250 },
  { category: 'transport', allocated: 150 },
  { category: 'health', allocated: 100 },
  { category: 'other', allocated: 300 },
];
