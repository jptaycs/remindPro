
import React from 'react';
import { 
  User, 
  Briefcase, 
  Receipt, 
  Gavel, 
  Settings, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Zap,
  Droplets,
  Globe,
  CreditCard,
  Building2
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  [Category.PERSONAL]: <User className="w-5 h-5" />,
  [Category.BUSINESS]: <Briefcase className="w-5 h-5" />,
  [Category.BILLS]: <Receipt className="w-5 h-5" />,
  [Category.TAXES]: <Gavel className="w-5 h-5" />,
  [Category.CUSTOM]: <Settings className="w-5 h-5" />,
  'Electricity': <Zap className="w-4 h-4" />,
  'Water': <Droplets className="w-4 h-4" />,
  'Internet': <Globe className="w-4 h-4" />,
  'Credit Card': <CreditCard className="w-4 h-4" />,
  'BIR': <Building2 className="w-4 h-4" />,
};

export const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-blue-100 text-blue-700',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.PERSONAL]: 'bg-indigo-500',
  [Category.BUSINESS]: 'bg-sky-500',
  [Category.BILLS]: 'bg-emerald-500',
  [Category.TAXES]: 'bg-rose-500',
  [Category.CUSTOM]: 'bg-slate-500',
};
