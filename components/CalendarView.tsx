
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  onSelectDate: (date: Date | null) => void;
  selectedDate: Date | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const days = Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDayOfMonth }, (_, i) => i);

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
  };

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
    });
  };

  return (
    <div className="bg-white dark:bg-ios-darkCard rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(i => <div key={`b-${i}`} className="aspect-square" />)}
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const hasTasks = dayTasks.length > 0;
          
          return (
            <button
              key={day}
              onClick={() => onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 ${
                isSelected(day) 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold' 
                  : isToday(day)
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-sm">{day}</span>
              {hasTasks && !isSelected(day) && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from(new Set(dayTasks.map(t => t.category))).slice(0, 3).map(cat => (
                    <div key={cat} className={`w-1 h-1 rounded-full ${CATEGORY_COLORS[cat]}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
