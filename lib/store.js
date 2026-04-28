import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice'; // Adjust the import path as needed

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    // DevTools is enabled by default in development
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Export types (optional in JS, but good practice for clarity)
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];
