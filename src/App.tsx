import React, { useEffect, useState } from 'react';
import { Task } from './types';
import { STORAGE_KEY, CATEGORIES, CATEGORY_COLORS, fmtDate } from './constants';
import CursorBall from './CursorBall';
import FloatingOrbs from './FloatingOrbs';
export default function App() {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState('Work');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed)) setTasks(parsed.map(t => ({ ...t, completed: Boolean(t.completed) })));
      }
    } catch { setTasks([]); }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const handleAddTask = () => {
    const trimmed = taskTitle.trim();
    if (!trimmed) return;
    setTasks(prev => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      category: selectedCategory,
      dueDate,
      completed: false,
    }, ...prev]);
    setTaskTitle('');
    setDueDate('');
  };

  const handleToggle = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

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

  const handleSaveEdit = (id: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: trimmed, category: editingCategory, dueDate: editingDueDate } : t));
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (editingTaskId === id) handleCancelEdit();
  };

  const filteredTasks = activeFilter === 'all' ? tasks : tasks.filter(t => t.category === activeFilter);
  const filters = ['all', ...CATEGORIES.filter(c => c !== 'Others')];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; cursor: none !important; }
        body { background: #060818; }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(201,169,110,0); }
        }

        .app-enter { animation: fadeSlideIn 0.6s ease both; }
        .task-row { animation: fadeSlideIn 0.3s ease both; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .task-row:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06) !important; }

        .add-btn:hover { animation: pulseGold 1s ease infinite; transform: scale(1.06) !important; }

        .filter-pill { transition: all 0.2s ease; }
        .filter-pill:hover { transform: translateY(-1px); }

        .checkbox-circle { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .checkbox-circle:hover { transform: scale(1.15); }

        .glass-input:focus { outline: none; border-color: rgba(201,169,110,0.8) !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.15) !important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.2); }

        .action-btn { transition: all 0.18s ease; }
        .action-btn:hover { transform: scale(1.1); }

        .progress-shine {
          background: linear-gradient(90deg, #c9a96e, #f0d898, #c9a96e);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }

        select option { background: #12111a; color: #e8e2d9; }
      `}</style>

      <CursorBall />
      <FloatingOrbs />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 20%, #0d1535 0%, #060818 50%, #0a0a14 100%)',
      }} />
      {/* Noise grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '56px 24px 80px', fontFamily: "'Outfit', sans-serif" }}>
        <div className={mounted ? 'app-enter' : ''} style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e', boxShadow: '0 0 8px #c9a96e' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a96e', fontWeight: 500 }}>
                Greg To-do
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px, 7vw, 64px)',
              fontWeight: 500,
              color: '#f5f0e8',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 14,
            }}>
              My Tasks
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: '#c9a96e', fontWeight: 600 }}>{completed}</span> completed
              </span>
              <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: '#f5f0e8', fontWeight: 500 }}>{total - completed}</span> remaining
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 13, color: '#c9a96e', fontWeight: 600 }}>{pct}%</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div className="progress-shine" style={{ height: '100%', width: `${pct}%`, borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* ── Input Card (glass) ── */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '24px 28px',
            marginBottom: 28,
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input
                className="glass-input"
                type="text"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  color: '#f5f0e8',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15,
                  fontWeight: 300,
                  padding: '12px 16px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              <button
                className="add-btn"
                onClick={handleAddTask}
                style={{
                  width: 46, height: 46,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a96e, #e8ca90)',
                  border: 'none',
                  cursor: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0e0e10" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="10" y1="4" x2="10" y2="16" />
                  <line x1="4" y1="10" x2="16" y2="10" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <select
                className="glass-input"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  color: '#c9a96e',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '10px 14px',
                  transition: 'border-color 0.2s',
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                className="glass-input"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  color: dueDate ? '#f5f0e8' : 'rgba(255,255,255,0.25)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  padding: '10px 14px',
                  colorScheme: 'dark',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* ── Filter Pills ── */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {filters.map(f => (
              <button
                key={f}
                className="filter-pill"
                onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f
                    ? 'linear-gradient(135deg, #c9a96e, #e8ca90)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  border: activeFilter === f ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  color: activeFilter === f ? '#0a0a14' : 'rgba(255,255,255,0.5)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: activeFilter === f ? 600 : 400,
                  letterSpacing: '0.06em',
                  padding: '7px 18px',
                  cursor: 'none',
                  textTransform: 'capitalize',
                  boxShadow: activeFilter === f ? '0 4px 16px rgba(201,169,110,0.3)' : 'none',
                }}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* ── Section Label ── */}
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 16, paddingLeft: 4 }}>
            — {activeFilter === 'all' ? 'All tasks' : activeFilter}
          </div>

          {/* ── Tasks ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredTasks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '72px 0',
                color: 'rgba(255,255,255,0.15)', fontSize: 14, fontWeight: 300,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round">
                    <rect x="3" y="2" width="12" height="14" rx="2.5" />
                    <line x1="6.5" y1="7" x2="11.5" y2="7" />
                    <line x1="6.5" y1="10" x2="11.5" y2="10" />
                  </svg>
                </div>
                Nothing here yet
              </div>
            ) : (
              filteredTasks.map((task, i) => (
                <div
                  key={task.id}
                  className="task-row"
                  style={{
                    background: task.completed
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid rgba(255,255,255,${task.completed ? '0.04' : '0.09'})`,
                    borderRadius: 16,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                    animationDelay: `${i * 0.05}s`,
                    opacity: task.completed ? 0.5 : 1,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="checkbox-circle"
                    onClick={() => handleToggle(task.id)}
                    style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: task.completed ? 'linear-gradient(135deg, #c9a96e, #e8ca90)' : 'transparent',
                      border: task.completed ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: task.completed ? '0 2px 10px rgba(201,169,110,0.5)' : 'none',
                    }}
                  >
                    {task.completed && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="#0a0a14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1,4.5 4.5,8 10,1" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  {editingTaskId === task.id ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input
                        className="glass-input"
                        type="text"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        autoFocus
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(201,169,110,0.6)',
                          borderRadius: 10,
                          color: '#f5f0e8',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 14,
                          padding: '9px 13px',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <select
                          className="glass-input"
                          value={editingCategory}
                          onChange={e => setEditingCategory(e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            color: '#c9a96e',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                            padding: '7px 11px',
                          }}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                          className="glass-input"
                          type="date"
                          value={editingDueDate}
                          onChange={e => setEditingDueDate(e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            color: editingDueDate ? '#f5f0e8' : 'rgba(255,255,255,0.25)',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                            padding: '7px 11px',
                            colorScheme: 'dark',
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          style={{
                            background: 'linear-gradient(135deg, #c9a96e, #e8ca90)',
                            border: 'none', borderRadius: 8,
                            color: '#0a0a14',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12, fontWeight: 600,
                            padding: '7px 16px',
                            cursor: 'none',
                            boxShadow: '0 2px 10px rgba(201,169,110,0.35)',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 8,
                            color: 'rgba(255,255,255,0.6)',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                            padding: '7px 14px',
                            cursor: 'none',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 400,
                        color: task.completed ? 'rgba(255,255,255,0.25)' : '#f0ebe3',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: 4,
                      }}>
                        {task.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                          fontWeight: 600,
                          color: CATEGORY_COLORS[task.category] || '#c9a96e',
                          background: `${CATEGORY_COLORS[task.category] || '#c9a96e'}18`,
                          padding: '3px 8px', borderRadius: 100,
                          border: `1px solid ${CATEGORY_COLORS[task.category] || '#c9a96e'}30`,
                        }}>
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                            {fmtDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons — always visible */}
                  {editingTaskId !== task.id && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        className="action-btn"
                        onClick={() => handleStartEdit(task)}
                        title="Edit"
                        style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'rgba(124,158,245,0.15)',
                          border: '1px solid rgba(124,158,245,0.35)',
                          color: '#7c9ef5',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'none',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M10 1.5l1.5 1.5-7.5 7.5H2.5V9L10 1.5z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDelete(task.id)}
                        title="Delete"
                        style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'rgba(248,113,113,0.15)',
                          border: '1px solid rgba(248,113,113,0.35)',
                          color: '#f87171',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'none',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <line x1="2" y1="3.5" x2="11" y2="3.5" />
                          <path d="M4.5 3.5V2.5h4v1" />
                          <rect x="3" y="4.5" width="7" height="7" rx="1.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}