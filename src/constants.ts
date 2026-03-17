export const STORAGE_KEY = 'gregtodo.tasks';

export const CATEGORIES = ['Work', 'Personal', 'Health', 'Shopping', 'Others'];

export const CATEGORY_COLORS: Record<string, string> = {
  Work:     '#7c9ef5',
  Personal: '#a78bfa',
  Health:   '#6ee7b7',
  Shopping: '#fbbf24',
  Others:   '#f87171',
};

export const fmtDate = (d: string): string => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};
