import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Sidebar } from '../components/layout/Sidebar';
import { BoundedContextProvider } from '../contexts/BoundedContextContext';

export const ContextLayout: React.FC = () => {
  return (
    <BoundedContextProvider>
      <AppShell showSidebar sidebar={<Sidebar />}>
        <Outlet />
      </AppShell>
    </BoundedContextProvider>
  );
};