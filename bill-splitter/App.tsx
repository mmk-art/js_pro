import React from 'react';
import { AppProvider } from './src/storage/AppContext';
import { RootNavigation } from './src/navigation';

export default function App() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}
