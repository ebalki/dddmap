import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useCMLModel } from '../contexts/CMLModelContext';
import type { Relationship } from '../types/cml.types';

export const ContextMap: React.FC = () => {
  const navigate = useNavigate();
  const { model, loading, error } = useCMLModel();

  if (loading) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="text-center">
            <p className="text-gray-600">Loading context map...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !model) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="text-center text-red-600">
            <p>Error loading context map</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const boundedContexts = model.boundedContexts || [];
  const relationships = model.contextMap?.relationships || [];

  // Helper function to get relationship type label
  const getRelationshipLabel = (rel: Relationship): string => {
    switch (rel.type) {
      case 'Partnership':
        return '[P] Partnership';
      case 'SharedKernel':
        return '[SK] Shared Kernel';
      case 'CustomerSupplier':
        return '[U,S] → [D,C] Customer-Supplier';
      case 'UpstreamDownstream':
        const upstreamRoles = rel.upstreamRoles?.map(r => r === 'PUBLISHED_LANGUAGE' ? 'PL' : 'OHS') || [];
        const downstreamRoles = rel.downstreamRoles?.map(r => r === 'ANTICORRUPTION_LAYER' ? 'ACL' : 'CF') || [];
        const upstreamLabel = ['U', ...upstreamRoles].join(',');
        const downstreamLabel = ['D', ...downstreamRoles].join(',');
        return `[${upstreamLabel}] → [${downstreamLabel}] Upstream-Downstream`;
      default:
        return rel.type;
    }
  };

  // Helper function to get relationship direction
  const getRelationshipDirection = (rel: Relationship): { from: string; to: string } | null => {
    if (rel.type === 'Partnership' || rel.type === 'SharedKernel') {
      return {
        from: rel.participant1,
        to: rel.participant2,
      };
    } else if (rel.type === 'UpstreamDownstream' || rel.type === 'CustomerSupplier') {
      return {
        from: rel.upstream,
        to: rel.downstream,
      };
    }
    return null;
  };

  return (
    <AppShell>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {model.contextMap?.name || 'Context Map'}
            </h1>
            <p className="text-gray-600">Strategic design view of bounded contexts and their relationships</p>
            {model.contextMap?.type && (
              <p className="text-sm text-gray-500 mt-1">
                Type: {model.contextMap.type} | State: {model.contextMap.state || 'N/A'}
              </p>
            )}
          </div>

          {/* Visual Context Map */}
          <Card className="mb-8">
            <CardBody className="p-8">
              <div className="relative">
                {/* Grid layout for contexts */}
                <div className="grid grid-cols-2 gap-8">
                  {boundedContexts.map((context, index) => {
                    // Generate color based on index
                    const colors = [
                      'bg-blue-50 border-blue-300',
                      'bg-green-50 border-green-300',
                      'bg-purple-50 border-purple-300',
                      'bg-yellow-50 border-yellow-300',
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={context.name}
                        className={`relative ${colorClass} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
                        onClick={() => navigate(`/context/${context.name}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{context.name}</h3>
                          {context.type && (
                            <Badge variant="default">{context.type}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-4">
                          {context.domainVisionStatement || 'No description'}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="aggregate">{context.aggregates.length} Aggregates</Badge>
                          {context.implementationTechnology && (
                            <Badge variant="default" className="text-xs">
                              {context.implementationTechnology}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Note about visual connections */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Visual connection lines will be added in a future update</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Integration Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Context Relationships ({relationships.length})
            </h2>
            {relationships.length === 0 ? (
              <Card>
                <CardBody>
                  <p className="text-gray-600 text-center py-8">
                    No relationships defined between contexts
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {relationships.map((relationship, index) => {
                  const direction = getRelationshipDirection(relationship);
                  if (!direction) return null;

                  const sourceContext = boundedContexts.find(c => c.name === direction.from);
                  const targetContext = boundedContexts.find(c => c.name === direction.to);

                  // Generate colors
                  const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50'];
                  const sourceColor = sourceContext
                    ? colors[boundedContexts.indexOf(sourceContext) % colors.length]
                    : 'bg-gray-50';
                  const targetColor = targetContext
                    ? colors[boundedContexts.indexOf(targetContext) % colors.length]
                    : 'bg-gray-50';

                  const isBidirectional = relationship.type === 'Partnership' || relationship.type === 'SharedKernel';

                  return (
                    <Card key={index}>
                      <CardBody>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`${sourceColor} px-3 py-1 rounded-md font-medium text-gray-900`}>
                              {direction.from}
                            </div>
                            <span className="text-gray-400">
                              {isBidirectional ? '↔' : '→'}
                            </span>
                            <div className={`${targetColor} px-3 py-1 rounded-md font-medium text-gray-900`}>
                              {direction.to}
                            </div>
                          </div>
                          <Badge variant="integration">
                            {getRelationshipLabel(relationship)}
                          </Badge>
                        </div>

                        {relationship.implementationTechnology && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Technology:</span> {relationship.implementationTechnology}
                          </p>
                        )}

                        {(relationship.type === 'UpstreamDownstream' || relationship.type === 'CustomerSupplier') && (
                          <>
                            {relationship.exposedAggregates && relationship.exposedAggregates.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 font-medium mb-1">Exposed Aggregates:</p>
                                <div className="flex gap-2 flex-wrap">
                                  {relationship.exposedAggregates.map((agg, i) => (
                                    <Badge key={i} variant="aggregate">{agg}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {relationship.downstreamRights && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Downstream Rights:</span> {relationship.downstreamRights}
                              </p>
                            )}
                          </>
                        )}

                        {relationship.name && (
                          <p className="text-xs text-gray-500 mt-2">
                            Relationship: {relationship.name}
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
