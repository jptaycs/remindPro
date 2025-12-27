
import React, { useState } from 'react';
import { X, Calendar, Type as TypeIcon, Tag, Flag, Repeat, AlignLeft } from 'lucide-react';
import { Category, Priority, Recurrence, Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const SUB_CATEGORIES: Record<Category, string[]> = {
  [Category.PERSONAL]: ['Chores', 'Health', 'Fitness', 'Social'],
  [Category.BUSINESS]: ['Meetings', 'Development', 'Sales', 'Admin'],
  [Category.BILLS]: ['Electricity', 'Water', 'Internet', 'Credit Card'],
  [Category.TAXES]: ['BIR', 'Quarterly', 'Annual', 'LGU'],
  [Category.CUSTOM]: []
};

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [subCategory, setSubCategory] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>(Recurrence.NONE);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSave({
      title,
      notes,
      category,
      subCategory: subCategory || undefined,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      recurrence,
      isCompleted: false,
    });
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-ios-darkCard w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">New Obligation</h2>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <TypeIcon className="w-3 h-3" /> Description
            </label>
            <input required className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-gray-200 dark:placeholder:text-gray-800 text-gray-900 dark:text-white" placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Supplementary Notes
            </label>
            <textarea className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm p-4 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white min-h-[100px] resize-none" placeholder="Provide context, links, or specific requirements..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Category</label>
              <select className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold p-4 text-gray-900 dark:text-white" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Execution Date</label>
              <input required type="datetime-local" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold p-4 text-gray-900 dark:text-white" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Priority</label>
              <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
                {Object.values(Priority).map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${priority === p ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Recurrence</label>
              <select className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold p-4 text-gray-900 dark:text-white" value={recurrence} onChange={(e) => setRecurrence(e.target.value as Recurrence)}>
                {Object.values(Recurrence).map(rec => <option key={rec} value={rec}>{rec}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-6 pb-4">
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-indigo-500/30 active:scale-[0.98] transition-all text-sm uppercase tracking-widest">Register Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};
