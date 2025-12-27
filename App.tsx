
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  Sparkles,
  Calendar as CalendarIcon,
  List as ListIcon,
  PieChart,
  BrainCircuit,
  Settings as SettingsIcon,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  Moon,
  Sun,
  TrendingUp,
  Activity,
  Filter,
  X,
  // Added Clock to resolve "Cannot find name 'Clock'" error
  Clock
} from 'lucide-react';
import { Task, Category, Priority, TaskStats } from './types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from './constants';
import { TaskItem } from './components/TaskItem';
import { TaskModal } from './components/TaskModal';
import { CalendarView } from './components/CalendarView';
import { ProgressRing } from './components/ProgressRing';
import { getSmartSuggestions } from './services/gemini';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('remindpro_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'tasks' | 'insights' | 'settings'>('dashboard');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(new Date());
  const [taskFilter, setTaskFilter] = useState<'all' | 'high' | 'overdue' | 'bills'>('all');
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('remindpro_darkmode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('remindpro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('remindpro_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const stats: TaskStats = useMemo(() => {
    const now = new Date();
    const stats: TaskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.isCompleted).length,
      overdue: tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < now).length,
      upcoming: tasks.filter(t => !t.isCompleted && new Date(t.dueDate) >= now).length,
      byCategory: {
        [Category.PERSONAL]: 0,
        [Category.BUSINESS]: 0,
        [Category.BILLS]: 0,
        [Category.TAXES]: 0,
        [Category.CUSTOM]: 0,
      }
    };
    tasks.forEach(t => { if (!t.isCompleted) stats.byCategory[t.category]++; });
    return stats;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (taskFilter === 'high') result = result.filter(t => t.priority === Priority.HIGH && !t.isCompleted);
    if (taskFilter === 'overdue') result = result.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date());
    if (taskFilter === 'bills') result = result.filter(t => t.category === Category.BILLS && !t.isCompleted);

    return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, searchQuery, taskFilter]);

  const calendarTasks = useMemo(() => {
    if (!selectedCalendarDate) return [];
    return tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d.getDate() === selectedCalendarDate.getDate() && 
             d.getMonth() === selectedCalendarDate.getMonth() && 
             d.getFullYear() === selectedCalendarDate.getFullYear();
    });
  }, [tasks, selectedCalendarDate]);

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title!,
      description: taskData.description || '',
      notes: taskData.notes || '',
      category: taskData.category || Category.PERSONAL,
      subCategory: taskData.subCategory,
      priority: taskData.priority || Priority.MEDIUM,
      dueDate: taskData.dueDate!,
      recurrence: taskData.recurrence || 'None',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    } as Task;
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const fetchInsights = async () => {
    setLoadingSuggestions(true);
    const results = await getSmartSuggestions(tasks);
    setSuggestions(results);
    setLoadingSuggestions(false);
  };

  const businessProgress = useMemo(() => {
    const biz = tasks.filter(t => t.category === Category.BUSINESS || t.category === Category.TAXES);
    if (biz.length === 0) return 0;
    return (biz.filter(t => t.isCompleted).length / biz.length) * 100;
  }, [tasks]);

  const personalProgress = useMemo(() => {
    const pers = tasks.filter(t => t.category === Category.PERSONAL || t.category === Category.BILLS);
    if (pers.length === 0) return 0;
    return (pers.filter(t => t.isCompleted).length / pers.length) * 100;
  }, [tasks]);

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto bg-ios-bg dark:bg-ios-darkBg shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      {/* Dynamic Header */}
      <header className="px-6 pt-14 pb-6 bg-white/80 dark:bg-ios-darkCard/80 ios-blur border-b border-gray-200 dark:border-white/5 flex flex-col gap-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="animate-in fade-in slide-in-from-left-4">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">RemindPro</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Business Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-90 transition-all"
             >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             <button className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-90 transition-all">
                <Bell className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600 transition-colors group-focus-within:text-indigo-500" />
          <input 
            type="text" 
            placeholder="Search objectives..." 
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-white/5 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-40 px-6 pt-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 pb-10">
            {/* Efficiency Metrics */}
            <div className="bg-white dark:bg-ios-darkCard rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-around animate-in zoom-in-95 duration-500">
               <ProgressRing progress={businessProgress} label="Business" color="text-indigo-500" />
               <ProgressRing progress={personalProgress} label="Personal" color="text-emerald-500" />
               <div className="w-px h-12 bg-gray-100 dark:bg-white/5" />
               <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">Risks</span>
                  <span className="text-xs font-black dark:text-white">{stats.overdue}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-600 dark:bg-indigo-700 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer group">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Active Obligations</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-4xl font-black tracking-tighter">{stats.upcoming}</span>
                  <CalendarIcon className="w-10 h-10 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>
              <div 
                onClick={() => { setTaskFilter('overdue'); setActiveTab('tasks'); }}
                className={`p-6 rounded-[32px] shadow-xl transition-all cursor-pointer group active:scale-95 ${stats.overdue > 0 ? 'bg-rose-500 dark:bg-rose-600 text-white shadow-rose-500/20' : 'bg-white dark:bg-ios-darkCard text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 shadow-sm'}`}
              >
                <p className={`text-[10px] font-black uppercase tracking-widest ${stats.overdue > 0 ? 'opacity-60' : 'text-gray-400 dark:text-gray-500'}`}>Overdue</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-4xl font-black tracking-tighter">{stats.overdue}</span>
                  <AlertCircle className={`w-10 h-10 transition-all group-hover:scale-110 ${stats.overdue > 0 ? 'opacity-30 group-hover:opacity-100' : 'text-gray-200 dark:text-white/10'}`} />
                </div>
              </div>
            </div>

            {/* Critical Segments */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Critical Segments</h2>
              <div className="grid grid-cols-2 gap-4">
                {[Category.TAXES, Category.BILLS, Category.BUSINESS, Category.PERSONAL].map((cat, idx) => (
                  <button key={cat} className="bg-white dark:bg-ios-darkCard p-5 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-4 group animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`${CATEGORY_COLORS[cat]} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{cat}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{stats.byCategory[cat]} Open</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Timeline</h2>
            <CalendarView 
              tasks={tasks} 
              selectedDate={selectedCalendarDate} 
              onSelectDate={setSelectedCalendarDate} 
            />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {selectedCalendarDate?.toLocaleDateString([], { month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div className="space-y-3">
                {calendarTasks.length > 0 ? (
                  calendarTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                  ))
                ) : (
                  <div className="py-12 text-center bg-white dark:bg-ios-darkCard rounded-[32px] border border-dashed border-gray-100 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-300 dark:text-gray-700 uppercase tracking-widest">No entries for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4 animate-in fade-in duration-500 pb-10">
             <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Registry</h2>
                <div className="flex gap-2">
                  {taskFilter !== 'all' && (
                    <button onClick={() => setTaskFilter('all')} className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
             </div>

             <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
                {[
                  { id: 'all', label: 'All', icon: <ListIcon className="w-3.5 h-3.5" /> },
                  { id: 'high', label: 'Priority', icon: <AlertCircle className="w-3.5 h-3.5" /> },
                  { id: 'overdue', label: 'Overdue', icon: <Clock className="w-3.5 h-3.5" /> },
                  { id: 'bills', label: 'Bills', icon: <CreditCardIcon className="w-3.5 h-3.5" /> },
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setTaskFilter(f.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${taskFilter === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-ios-darkCard text-gray-400 border border-gray-100 dark:border-white/5'}`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>

             <div className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching registry entries</p>
                </div>
              )}
             </div>
          </div>
        )}

        {/* ... (Insights and Settings Tab remain same as previous version) */}
        {activeTab === 'insights' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-10">
             <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <BrainCircuit className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">AI Protocol</span>
                  </div>
                  <h2 className="text-3xl font-black mb-3 tracking-tight">Intelligence Hub</h2>
                  <p className="text-sm text-indigo-100 mb-8 max-w-[85%] font-medium leading-relaxed opacity-90">
                    Proactive analysis of your tax schedule and business overhead using Gemini Large Language Models.
                  </p>
                  <button onClick={fetchInsights} disabled={loadingSuggestions} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50">
                    {loadingSuggestions ? 'Calibrating...' : 'Analyze Obligations'}
                  </button>
                </div>
             </div>
             <div className="space-y-4">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="bg-white dark:bg-ios-darkCard p-6 rounded-[32px] shadow-sm border border-indigo-50 dark:border-indigo-500/10 flex items-start gap-5 animate-in slide-in-from-bottom-6" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0"><Sparkles className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white mb-1.5">{s.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{s.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="space-y-8 animate-in fade-in duration-500 pb-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white px-1">Settings</h2>
              <div className="bg-white dark:bg-ios-darkCard rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                  {[
                    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', status: 'Active', color: 'text-blue-500' },
                    { icon: <Moon className="w-5 h-5" />, label: 'Dark Interface', status: darkMode ? 'On' : 'Off', action: () => setDarkMode(!darkMode), color: 'text-indigo-500' },
                  ].map((item, i) => (
                    <div key={i} onClick={item.action} className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer active:bg-gray-100 dark:active:bg-white/[0.05]">
                      <div className="flex items-center gap-4">
                        <div className={`${item.color} bg-current/10 p-2.5 rounded-xl`}>{item.icon}</div>
                        <span className="font-bold text-gray-900 dark:text-white">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{item.status}</span>
                    </div>
                  ))}
              </div>
           </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-indigo-600 dark:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-90 transition-all group overflow-hidden"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
        </button>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-ios-darkCard/80 ios-blur safe-bottom border-t border-gray-100 dark:border-white/5 px-6 pt-4 flex justify-between items-center z-40 max-w-xl mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          { id: 'dashboard', icon: <LayoutDashboard className="w-6 h-6" />, label: 'Glance' },
          { id: 'calendar', icon: <CalendarIcon className="w-6 h-6" />, label: 'Timeline' },
          { id: 'tasks', icon: <ListIcon className="w-6 h-6" />, label: 'Registry' },
          { id: 'insights', icon: <PieChart className="w-6 h-6" />, label: 'Insights' },
          { id: 'settings', icon: <SettingsIcon className="w-6 h-6" />, label: 'System' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all relative py-2 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-gray-400 dark:text-gray-600'}`}
          >
            {tab.icon}
            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
            {activeTab === tab.id && <div className="absolute -top-1 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
          </button>
        ))}
      </nav>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addTask} />
    </div>
  );
};

// Helper Icon components
// Added missing Clock import in the main import list at the top of the file.
const ClockIcon = ({ className }: { className?: string }) => <Clock className={className} />;
const CreditCardIcon = ({ className }: { className?: string }) => <Activity className={className} />;

export default App;
