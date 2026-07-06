'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

export default function ReduxProvider({ children }) {
  // This function only runs ONCE on the initial mount
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}