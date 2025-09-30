import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Map } from 'lucide-react';
import { useCMLModel } from '../../contexts/CMLModelContext';

export const ContextSelector: React.FC = () => {
  const { model } = useCMLModel();
  const { contextId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const boundedContexts = model?.boundedContexts || [];
  const selectedContext = contextId ? boundedContexts.find(c => c.name === contextId) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectContext = (contextName: string) => {
    setIsOpen(false);
    navigate(`/context/${contextName}`);
  };

  const handleViewContextMap = () => {
    setIsOpen(false);
    navigate('/context-map');
  };

  // Generate dynamic colors for contexts
  const getContextColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
    return colors[index % colors.length];
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
            {boundedContexts.map((context, index) => (
              <button
                key={context.name}
                onClick={() => handleSelectContext(context.name)}
                className={`w-full px-4 py-2.5 text-left hover:bg-muted/20 transition-colors ${
                  contextId === context.name ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getContextColor(index)}`}></div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{context.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {context.domainVisionStatement || context.type || 'No description'}
                    </div>
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