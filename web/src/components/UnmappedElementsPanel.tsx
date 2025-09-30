import React, { useState } from 'react';
import { Package, Zap, ChevronRight, Code, Check, X } from 'lucide-react';
import type { UnmappedElement, BoundedContext, Aggregate } from '../types/cml.types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface MappingTarget {
  contextName: string;
  aggregateName: string;
  elementType: 'Entity' | 'Service' | 'ValueObject' | 'DomainEvent' | 'Command';
  elementName?: string;
  createNew?: boolean;
}

interface UnmappedElementsPanelProps {
  unmappedElements: UnmappedElement[];
  boundedContexts: BoundedContext[];
  onMap: (unmappedId: string, mapping: MappingTarget) => void;
  onSkip: (unmappedId: string) => void;
}

export function UnmappedElementsPanel({
  unmappedElements,
  boundedContexts,
  onMap,
  onSkip,
}: UnmappedElementsPanelProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [mappingTarget, setMappingTarget] = useState<Partial<MappingTarget>>({});

  const handleSelectElement = (elementId: string) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
    setMappingTarget({}); // Reset mapping target when selecting new element
  };

  const handleAcceptMapping = () => {
    if (
      selectedElement &&
      mappingTarget.contextName &&
      mappingTarget.aggregateName &&
      mappingTarget.elementType
    ) {
      onMap(selectedElement, mappingTarget as MappingTarget);
      setSelectedElement(null);
      setMappingTarget({});
    }
  };

  const handleSkip = (elementId: string) => {
    onSkip(elementId);
    if (selectedElement === elementId) {
      setSelectedElement(null);
      setMappingTarget({});
    }
  };

  const getAggregatesForContext = (contextName: string): Aggregate[] => {
    const context = boundedContexts.find(c => c.name === contextName);
    return context?.aggregates || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Unmapped Elements
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {unmappedElements.length} element{unmappedElements.length !== 1 ? 's' : ''} need{unmappedElements.length === 1 ? 's' : ''} to be mapped or reviewed
          </p>
        </div>
      </div>

      {/* Unmapped Elements List */}
      <div className="space-y-4">
        {unmappedElements.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Check className="w-12 h-12 text-green-500" />
              <p className="text-gray-600">
                All elements have been mapped! 🎉
              </p>
            </div>
          </Card>
        ) : (
          unmappedElements.map((element) => (
            <Card
              key={element.id}
              className={`transition-all ${
                selectedElement === element.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              {/* Element Header */}
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => handleSelectElement(element.id)}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    element.type === 'structure'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {element.type === 'structure' ? (
                    <Package className="w-5 h-5" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {element.name}
                    </h3>
                    <Badge
                      color={element.type === 'structure' ? 'yellow' : 'blue'}
                    >
                      {element.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {element.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {element.location}
                    </span>
                  </div>
                </div>

                {/* Expand Icon */}
                <ChevronRight
                  className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform ${
                    selectedElement === element.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Mapping Interface (Expanded) */}
              {selectedElement === element.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Map this element to:
                  </h4>

                  <div className="space-y-4">
                    {/* Context Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bounded Context
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={mappingTarget.contextName || ''}
                        onChange={(e) =>
                          setMappingTarget({
                            ...mappingTarget,
                            contextName: e.target.value,
                            aggregateName: undefined,
                          })
                        }
                      >
                        <option value="">Select context...</option>
                        {boundedContexts.map((ctx) => (
                          <option key={ctx.name} value={ctx.name}>
                            {ctx.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Aggregate Selection */}
                    {mappingTarget.contextName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aggregate
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={mappingTarget.aggregateName || ''}
                          onChange={(e) =>
                            setMappingTarget({
                              ...mappingTarget,
                              aggregateName: e.target.value,
                            })
                          }
                        >
                          <option value="">Select aggregate...</option>
                          {getAggregatesForContext(mappingTarget.contextName).map(
                            (agg) => (
                              <option key={agg.name} value={agg.name}>
                                {agg.name}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}

                    {/* Element Type Selection */}
                    {mappingTarget.aggregateName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Element Type
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={mappingTarget.elementType || ''}
                          onChange={(e) =>
                            setMappingTarget({
                              ...mappingTarget,
                              elementType: e.target.value as any,
                            })
                          }
                        >
                          <option value="">Select type...</option>
                          <option value="Entity">Entity</option>
                          <option value="Service">Service</option>
                          <option value="ValueObject">Value Object</option>
                          <option value="DomainEvent">Domain Event</option>
                          <option value="Command">Command</option>
                        </select>
                      </div>
                    )}

                    {/* Element Name (Optional - for new elements) */}
                    {mappingTarget.elementType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Element Name (optional - if creating new)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={element.name}
                          value={mappingTarget.elementName || ''}
                          onChange={(e) =>
                            setMappingTarget({
                              ...mappingTarget,
                              elementName: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        onClick={handleAcceptMapping}
                        disabled={
                          !mappingTarget.contextName ||
                          !mappingTarget.aggregateName ||
                          !mappingTarget.elementType
                        }
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept Mapping
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSkip(element.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
