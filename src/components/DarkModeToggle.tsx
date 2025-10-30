import React, { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('pref-dark') === '1';
    } catch { return false; }
  });

  useEffect(() => {
    const el = document.documentElement;
    if (dark) el.classList.add('dark'); else el.classList.remove('dark');
    try { localStorage.setItem('pref-dark', dark ? '1' : '0'); } catch {}
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="px-3 py-1 border rounded focus-ring"
      aria-pressed={dark}
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  );
};

export default DarkModeToggle;
