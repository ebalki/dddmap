import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ContextMappingModel } from '../types/cml.types';
import { parseCML } from '../utils/cmlParser';

interface CMLModelContextType {
  model: ContextMappingModel | null;
  loading: boolean;
  error: string | null;
  loadModel: (cmlContent: string) => void;
  loadFromFile: (url: string) => Promise<void>;
}

const CMLModelContext = createContext<CMLModelContextType | undefined>(undefined);

export function CMLModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<ContextMappingModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModel = (cmlContent: string) => {
    try {
      setLoading(true);
      setError(null);
      const parsed = parseCML(cmlContent);
      setModel(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CML');
      console.error('Error parsing CML:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFromFile = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CML file: ${response.statusText}`);
      }
      const content = await response.text();
      const parsed = parseCML(content);
      console.log('=== PARSED CML MODEL ===', parsed);
      console.log('Contexts:', parsed.boundedContexts?.length);
      parsed.boundedContexts?.forEach(ctx => {
        console.log(`${ctx.name}: ${ctx.aggregates.length} aggregates`);
        ctx.aggregates.forEach(agg => {
          console.log(`  - ${agg.name}: ${agg.commands.length} commands, ${agg.events.length} events`);
        });
      });
      setModel(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CML file');
      console.error('Error loading CML:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load sample CML on mount
  useEffect(() => {
    loadFromFile('/sample-ecommerce.cml');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CMLModelContext.Provider value={{ model, loading, error, loadModel, loadFromFile }}>
      {children}
    </CMLModelContext.Provider>
  );
}

export function useCMLModel() {
  const context = useContext(CMLModelContext);
  if (context === undefined) {
    throw new Error('useCMLModel must be used within a CMLModelProvider');
  }
  return context;
}
