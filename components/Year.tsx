'use client';

import { useEffect, useState } from 'react';

// The build year until the page runs, then this year
export function Year() {
  const [y, setY] = useState(2026);
  useEffect(() => setY(new Date().getFullYear()), []);
  return <span>{y}</span>;
}
