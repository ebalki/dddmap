import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Map } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';

export const ContextSelector: React.FC = () => {
  const { boundedContexts, selectedContextId, setSelectedContextId, getContextById } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const selectedContext = selectedContextId ? getContextById(selectedContextId) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectContext = (contextId: string) => {
    setSelectedContextId(contextId);
    setIsOpen(false);
    navigate(`/context/${contextId}`);
  };

  const handleViewContextMap = () => {
    setSelectedContextId(null);
    setIsOpen(false);
    navigate('/context-map');
  };

  // Context color mapping
  const contextColors: Record<string, string> = {
    'order-management': 'bg-chart-1',
    'inventory': 'bg-chart-3',
    'payment': 'bg-chart-4',
    'fulfillment': 'bg-chart-5',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-card border border-[#6F797A] rounded hover:bg-muted/10 transition-colors"
      >
        <span className="text-base font-medium text-foreground">
          {selectedContext ? selectedContext.name : 'Select Context'}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-card border border-[#6F797A] rounded-lg shadow-elevation-sm z-50">
          <div className="py-2">
            <button
              onClick={handleViewContextMap}
              className="w-full px-4 py-2.5 text-left hover:bg-muted/20 flex items-center space-x-3 text-primary font-medium"
            >
              <Map className="w-4 h-4" />
              <span>View Context Map</span>
            </button>
            <div className="border-t border-[#6F797A] my-2"></div>
            {boundedContexts.map((context) => (
              <button
                key={context.id}
                onClick={() => handleSelectContext(context.id)}
                className={`w-full px-4 py-2.5 text-left hover:bg-muted/20 transition-colors ${
                  selectedContextId === context.id ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${contextColors[context.id] || 'bg-muted'}`}></div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{context.name}</div>
                    <div className="text-xs text-muted-foreground">{context.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};