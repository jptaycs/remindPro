
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  BILLS = 'Bills',
  TAXES = 'Taxes',
  CUSTOM = 'Custom'
}

export enum Recurrence {
  NONE = 'None',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  notes?: string;
  category: Category;
  subCategory?: string;
  priority: Priority;
  dueDate: string; // ISO string
  recurrence: Recurrence;
  isCompleted: boolean;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  upcoming: number;
  byCategory: Record<Category, number>;
}
