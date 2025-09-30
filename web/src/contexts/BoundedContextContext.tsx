import React, { createContext, useContext, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import type { BoundedContext } from '../types/ddd.types';
import { useProject } from './ProjectContext';

interface BoundedContextContextType {
  currentContext: BoundedContext | null;
}

const BoundedContextContext = createContext<BoundedContextContextType | undefined>(undefined);

export const BoundedContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { contextId } = useParams<{ contextId: string }>();
  const { getContextById } = useProject();

  const currentContext = contextId ? getContextById(contextId) || null : null;

  return (
    <BoundedContextContext.Provider value={{ currentContext }}>
      {children}
    </BoundedContextContext.Provider>
  );
};

export const useBoundedContext = (): BoundedContextContextType => {
  const context = useContext(BoundedContextContext);
  if (!context) {
    throw new Error('useBoundedContext must be used within a BoundedContextProvider');
  }
  return context;
};