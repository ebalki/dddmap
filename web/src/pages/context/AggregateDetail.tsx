import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Zap, Shield } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const AggregateDetail: React.FC = () => {
  const { aggregateId } = useParams<{ aggregateId: string }>();
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  const aggregate = currentContext.aggregates.find(agg => agg.id === aggregateId);
  if (!aggregate) return <div className="p-8">Aggregate not found</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Box className="w-6 h-6 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{aggregate.name}</h1>
          </div>
          <p className="text-gray-600">Aggregate in {currentContext.name} context</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Structure */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Diagram */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Aggregate Structure</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {/* Root Entity */}
                  <div className="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="aggregate">Root Entity</Badge>
                      <h3 className="font-bold text-gray-900">{aggregate.rootEntity.name}</h3>
                    </div>
                    <div className="space-y-1">
                      {aggregate.rootEntity.properties.map((prop) => (
                        <div key={prop.name} className="text-sm text-gray-700 flex items-center justify-between">
                          <span className="font-mono">{prop.name}</span>
                          <span className="text-gray-500">{prop.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Child Entities */}
                  {aggregate.entities.map((entity) => (
                    <div key={entity.id} className="border border-gray-300 rounded-lg p-4 ml-8">
                      <h3 className="font-bold text-gray-900 mb-2">{entity.name}</h3>
                      <div className="space-y-1">
                        {entity.properties.map((prop) => (
                          <div key={prop.name} className="text-sm text-gray-700 flex items-center justify-between">
                            <span className="font-mono">{prop.name}</span>
                            <span className="text-gray-500">{prop.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Value Objects */}
                  {aggregate.valueObjects.map((vo) => (
                    <div key={vo.id} className="border border-blue-300 rounded-lg p-4 ml-8 bg-blue-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="command">Value Object</Badge>
                        <h3 className="font-bold text-gray-900">{vo.name}</h3>
                      </div>
                      <div className="space-y-1">
                        {vo.properties.map((prop) => (
                          <div key={prop.name} className="text-sm text-gray-700 flex items-center justify-between">
                            <span className="font-mono">{prop.name}</span>
                            <span className="text-gray-500">{prop.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Business Rules */}
            <Card>
              <CardHeader className="bg-green-50">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Business Rules & Invariants</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {aggregate.businessRules.map((rule) => (
                    <div key={rule.id} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{rule.name}</h3>
                      <p className="text-sm text-gray-700 mb-2">{rule.description}</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 block">
                        {rule.invariant}
                      </code>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Commands & Events */}
          <div className="space-y-6">
            {/* Commands */}
            <Card>
              <CardHeader className="bg-blue-50">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Commands</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {aggregate.commands.map((cmd) => (
                    <div key={cmd.id} className="border border-blue-200 rounded p-3 bg-blue-50">
                      <h3 className="font-semibold text-blue-900 text-sm mb-2">{cmd.name}</h3>
                      <div className="space-y-1">
                        {cmd.parameters.map((param) => (
                          <div key={param.name} className="text-xs text-gray-700">
                            <span className="font-mono">{param.name}</span>: {param.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Events */}
            <Card>
              <CardHeader className="bg-orange-50">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Events</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {aggregate.events.map((event) => (
                    <div key={event.id} className="border border-orange-200 rounded p-3 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-orange-900 text-sm">{event.name}</h3>
                        {event.isPublished && <Badge variant="event">Published</Badge>}
                      </div>
                      <div className="space-y-1">
                        {event.properties.map((prop) => (
                          <div key={prop.name} className="text-xs text-gray-700">
                            <span className="font-mono">{prop.name}</span>: {prop.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};