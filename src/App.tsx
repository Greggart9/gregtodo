import React, { useEffect, useRef, useState } from 'react';
import { FaListCheck } from "react-icons/fa6";
import { LuPlus, LuClipboardList, LuUser, LuBriefcase, LuHeart, LuShoppingCart } from "react-icons/lu";

type Task = {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

const STORAGE_KEY = 'gregtodo.tasks';

function App() {

  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState('Work');
  const [editingDueDate, setEditingDueDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      clipboard: <LuClipboardList className="w-4 h-4" />,
      home: <LuUser className="w-4 h-4" />,
      briefcase: <LuBriefcase className="w-4 h-4" />,
      heart: <LuHeart className="w-4 h-4" />,
      cart: <LuShoppingCart className="w-4 h-4" />,
    };
    return iconMap[iconName];
  };

  const categoryPills = [
    { key: 'all', label: 'All', iconName: 'clipboard' },
    { key: 'Personal', label: 'Personal', iconName: 'home' },
    { key: 'Work', label: 'Work', iconName: 'briefcase' },
    { key: 'Health', label: 'Health', iconName: 'heart' },
    { key: 'Shopping', label: 'Shopping', iconName: 'cart' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Task[];
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((task) => ({
          ...task,
          completed: Boolean(task.completed),
        }));
        setTasks(normalized);
      }
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
  

  const handleAddTask = () => {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmedTitle,
      category: selectedCategory,
      dueDate,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskTitle('');
    setDueDate('');
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingCategory(task.category);
    setEditingDueDate(task.dueDate);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingCategory('Work');
    setEditingDueDate('');
  };

  const handleSaveEdit = (taskId: string) => {
    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: trimmedTitle,
              category: editingCategory,
              dueDate: editingDueDate,
            }
          : task
      )
    );
    handleCancelEdit();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (editingTaskId === taskId) {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex items-center justify-center py-20 p-4">
       <div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl'>


      {/* HEADER */}
      <section className='flex w-full justify-between items-center'>
        {/* LEFT */}
        <div className='flex flex-col items-start'>
          <div className='flex items-center space-x-3'>
            <FaListCheck className="text-gray-600 w-6 h-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              My Tasks
            </h1>
          </div>
            <p className="text-gray-600 text-left">
              {/* All caught up! 🎉 */}
            </p>
          </div>


          {/* RIGHT */}
          <div className='flex space-x-5'>
            {/* <p>0% </p>
            <p>0 of 0 tasks done</p> */}
          </div>




      </section>

      {/* TODO INPUT */}
      <section className='mt-7'>
        <div className='flex space-x-5'>
        <input
          type="text"
          placeholder="What need to be done?"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleAddTask}
          className=" bg-purple-500 text-white px-4 py-1 rounded-lg hover:bg-purple-600 transition-colors"
        >
          <LuPlus />
        </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className='mt-7'>
         
         {/* UP */}
        <div className='flex space-x-2 sm:space-x-4'>
          <div className='bg-white px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500'>
            <select
              className='outline-none border-none bg-transparent'
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option className='' value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            
             </select>
          
          </div>
            
            {/* DATE */}
          <div
            className="relative flex w-full sm:w-auto bg-white justify-center items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-purple-500 cursor-pointer"
            onClick={() => {
              const input = dateInputRef.current;
              if (!input) return;
              if (typeof input.showPicker === 'function') {
                input.showPicker();
              } else {
                input.focus();
              }
            }}
          >
            {!dueDate && (
              <span className="absolute left-3 text-sm text-gray-400 pointer-events-none">
                dd/mm/yyyy
              </span>
            )}
            <input
              type="date"
              ref={dateInputRef}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full min-w-[120px] outline-none border-none bg-transparent text-gray-700 text-sm [color-scheme:light]"
            />

          </div>

        </div>

        {/* DOWN */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categoryPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setActiveFilter(pill.key)}
              className={
                activeFilter === pill.key
                  ? 'flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer'
                  : 'flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200'
              }
            >
              {getIconComponent(pill.iconName)}
              <span>{pill.label}</span>
            </button>
          ))}
        </div>


      </section>

      {/* TASK */}
      <section>
        <div className='mt-8 space-y-3'>
          {(() => {
            const filteredTasks = activeFilter === 'all'
              ? tasks
              : tasks.filter((task) => task.category === activeFilter);
            
            return filteredTasks.length === 0 ? (
              <p className='text-gray-500'>No tasks yet. Add one above!</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'
                >
                  <div className='flex items-start gap-3 flex-1'>
                    <input
                      type='checkbox'
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className='mt-1 h-4 w-4 accent-purple-500'
                      aria-label={`Mark ${task.title} as done`}
                    />

                    {editingTaskId === task.id ? (
                      <div className='flex-1 space-y-2'>
                        <input
                          type='text'
                          value={editingTitle}
                          onChange={(event) => setEditingTitle(event.target.value)}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
                        />
                        <div className='flex flex-wrap gap-2'>
                          <select
                            className='rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                            value={editingCategory}
                            onChange={(event) => setEditingCategory(event.target.value)}
                          >
                            <option value='Work'>Work</option>
                            <option value='Health'>Health</option>
                            <option value='Personal'>Personal</option>
                            <option value='Shopping'>Shopping</option>
                            <option value='Others'>Others</option>
                          </select>
                          <div className='relative'>
                            {!editingDueDate && (
                              <span className='absolute left-3 top-2 text-sm text-gray-400 pointer-events-none'>
                                dd/mm/yyyy
                              </span>
                            )}
                            <input
                              type='date'
                              value={editingDueDate}
                              onChange={(event) => setEditingDueDate(event.target.value)}
                              className='rounded-md border border-gray-300 px-3 py-2 text-sm outline-none [color-scheme:light]'
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p
                          className={
                            task.completed
                              ? 'text-gray-500 font-medium line-through'
                              : 'text-gray-800 font-medium'
                          }
                        >
                          {task.title}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {task.category}
                          {task.dueDate ? ` • ${task.dueDate}` : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center gap-2'>
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className='rounded-md bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600'
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className='rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100'
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(task)}
                          className='rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className='rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            );
          })()}
        </div>
      </section>
  
      </div>
    </div>
  );
}

export default App;
