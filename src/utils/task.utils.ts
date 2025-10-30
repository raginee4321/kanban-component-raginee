export const isOverdue = (dueDate?: string | Date) => {
  if (!dueDate) return false;
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return new Date() > d;
};

export const getInitials = (name?: string) => {
  if (!name) return '';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2);
};

export const reorder = (arr: string[], from: number, to: number) => {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};
