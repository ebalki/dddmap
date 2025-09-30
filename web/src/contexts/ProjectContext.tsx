import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { BoundedContext } from '../types/ddd.types';
import { mockBoundedContexts } from '../data/mockData';

interface ProjectContextType {
  boundedContexts: BoundedContext[];
  selectedContextId: string | null;
  setSelectedContextId: (id: string | null) => void;
  getContextById: (id: string) => BoundedContext | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boundedContexts] = useState<BoundedContext[]>(mockBoundedContexts);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);

  const getContextById = (id: string): BoundedContext | undefined => {
    return boundedContexts.find(ctx => ctx.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        boundedContexts,
        selectedContextId,
        setSelectedContextId,
        getContextById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};