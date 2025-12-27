
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { CheckCircle2, Circle, Clock, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORY_ICONS, PRIORITY_COLORS } from '../constants';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverdue = new Date(task.dueDate) < new Date() && !task.isCompleted;
  const isHighPriority = task.priority === Priority.HIGH;

  return (
    <div className={`group relative flex flex-col bg-white dark:bg-ios-darkCard p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-white/5 transition-all active:scale-[0.99] ${isHighPriority && !task.isCompleted ? 'ring-1 ring-red-500/20 dark:ring-red-500/10' : ''}`}>
      <div className="flex items-center">
        <button 
          onClick={() => onToggle(task.id)}
          className="mr-5 flex-shrink-0 transition-all active:scale-75"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-7 h-7 text-green-500 fill-green-50 dark:fill-green-500/10" />
          ) : (
            <Circle className={`w-7 h-7 transition-colors ${isOverdue ? 'text-rose-500 dark:text-rose-400' : 'text-gray-200 dark:text-gray-700 group-hover:text-indigo-400'}`} />
          )}
        </button>

        <div className="flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-bold truncate transition-all ${task.isCompleted ? 'text-gray-300 dark:text-gray-700 line-through' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </h3>
            {isHighPriority && !task.isCompleted && (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse-subtle" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
            <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 flex items-center gap-1 flex-shrink-0">
              {CATEGORY_ICONS[task.subCategory || task.category] || CATEGORY_ICONS[task.category]}
              {task.subCategory || task.category}
            </span>
            <div className="h-1 w-1 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
            <span className={`text-[9px] flex items-center gap-1 font-bold whitespace-nowrap ${isOverdue ? 'text-rose-500 dark:text-rose-400 font-black' : 'text-gray-400 dark:text-gray-600'}`}>
              <Clock className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.notes && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-300 dark:text-gray-700 hover:text-indigo-500">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2.5 text-gray-300 dark:text-gray-700 hover:text-rose-500 dark:hover:text-rose-400 transition-all rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && task.notes && (
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 animate-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic font-medium">
            {task.notes}
          </p>
        </div>
      )}
    </div>
  );
};
