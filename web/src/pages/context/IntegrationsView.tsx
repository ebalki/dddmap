import React from 'react';
import { Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';
import { useCMLModel } from '../../contexts/CMLModelContext';

export const IntegrationsView: React.FC = () => {
  const { currentContext } = useBoundedContext();
  const { model } = useCMLModel();

  if (!currentContext || !model) return null;

  const relationships = model.contextMap?.relationships || [];

  // Find relationships where current context is upstream (publishes to others)
  const upstreamRelationships = relationships.filter(rel => {
    if (rel.type === 'UpstreamDownstream' || rel.type === 'CustomerSupplier') {
      return rel.upstream === currentContext.name;
    }
    if (rel.type === 'Partnership' || rel.type === 'SharedKernel') {
      return rel.participant1 === currentContext.name || rel.participant2 === currentContext.name;
    }
    return false;
  });

  // Find relationships where current context is downstream (consumes from others)
  const downstreamRelationships = relationships.filter(rel => {
    if (rel.type === 'UpstreamDownstream' || rel.type === 'CustomerSupplier') {
      return rel.downstream === currentContext.name;
    }
    return false;
  });

  const getRelationshipLabel = (rel: typeof relationships[0]): string => {
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
        return `[${upstreamLabel}] → [${downstreamLabel}]`;
      default:
        return rel.type;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <LinkIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          </div>
          <p className="text-gray-600">Cross-context relationships for {currentContext.name}</p>
        </div>

        {/* Upstream Relationships (We provide services to others) */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Outbound Relationships</h2>
          {upstreamRelationships.length > 0 ? (
            <div className="space-y-4">
              {upstreamRelationships.map((rel, idx) => {
                const target = rel.type === 'UpstreamDownstream' || rel.type === 'CustomerSupplier'
                  ? rel.downstream
                  : rel.participant1 === currentContext.name ? rel.participant2 : rel.participant1;

                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded font-medium">
                            {currentContext.name}
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className="bg-green-100 text-green-900 px-3 py-1 rounded font-medium">
                            {target}
                          </div>
                        </div>
                        <Badge variant="default">{getRelationshipLabel(rel)}</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2">
                        {rel.implementationTechnology && (
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Technology: </span>
                            <span className="text-sm text-gray-600">{rel.implementationTechnology}</span>
                          </div>
                        )}
                        {rel.exposedAggregates && rel.exposedAggregates.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Exposed Aggregates:</p>
                            <div className="flex gap-2 flex-wrap">
                              {rel.exposedAggregates.map((agg) => (
                                <Badge key={agg} variant="aggregate">{agg}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-500 py-4">
                  No outbound integrations from this context
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Downstream Relationships (We consume services from others) */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Inbound Relationships</h2>
          {downstreamRelationships.length > 0 ? (
            <div className="space-y-4">
              {downstreamRelationships.map((rel, idx) => {
                const source = rel.upstream;

                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 text-green-900 px-3 py-1 rounded font-medium">
                            {source}
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded font-medium">
                            {currentContext.name}
                          </div>
                        </div>
                        <Badge variant="default">{getRelationshipLabel(rel)}</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2">
                        {rel.implementationTechnology && (
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Technology: </span>
                            <span className="text-sm text-gray-600">{rel.implementationTechnology}</span>
                          </div>
                        )}
                        {rel.downstreamRights && (
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Downstream Rights: </span>
                            <span className="text-sm text-gray-600">{rel.downstreamRights}</span>
                          </div>
                        )}
                        {rel.exposedAggregates && rel.exposedAggregates.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Consumed Aggregates:</p>
                            <div className="flex gap-2 flex-wrap">
                              {rel.exposedAggregates.map((agg) => (
                                <Badge key={agg} variant="aggregate">{agg}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-500 py-4">
                  No inbound integrations to this context
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
