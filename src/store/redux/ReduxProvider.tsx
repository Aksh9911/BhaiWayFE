import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { bootstrapReduxRuntime, store } from '@/store/redux';

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => bootstrapReduxRuntime(), []);

  return <Provider store={store}>{children}</Provider>;
};
