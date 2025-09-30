import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const AggregatesView: React.FC = () => {
  const { currentContext } = useBoundedContext();
  const navigate = useNavigate();

  if (!currentContext) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aggregates</h1>
          <p className="text-gray-600">Domain aggregates in {currentContext.name} context</p>
        </div>

        {currentContext.aggregates.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-gray-600 py-8">No aggregates defined in this context</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentContext.aggregates.map((aggregate) => {
              const rootEntity = aggregate.entities.find(e => e.aggregateRoot);
              const businessRules = (aggregate.responsibilities || []).filter(r => r.startsWith('RULE:'));

              return (
                <Card key={aggregate.name} hover onClick={() => navigate(aggregate.name)}>
                  <CardHeader className="bg-yellow-50">
                    <div className="flex items-center space-x-3">
                      <Box className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{aggregate.name}</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {rootEntity && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Root Entity</p>
                          <p className="font-medium text-gray-900">{rootEntity.name}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Entities</p>
                          <p className="font-semibold text-gray-900">{aggregate.entities.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Value Objects</p>
                          <p className="font-semibold text-gray-900">{aggregate.valueObjects.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Services</p>
                          <p className="font-semibold text-gray-900">{aggregate.services?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="command">{aggregate.commands?.length || 0} Commands</Badge>
                        <Badge variant="event">{aggregate.events?.length || 0} Events</Badge>
                        <Badge variant="rule">{businessRules.length} Rules</Badge>
                      </div>

                      {/* Show first 2 business rules */}
                      {businessRules.slice(0, 2).map((rule, idx) => {
                        const ruleText = rule.substring(6).trim(); // Remove "RULE: " prefix
                        return (
                          <div key={idx} className="bg-green-50 border border-green-200 rounded p-3">
                            <p className="text-sm font-medium text-green-900">{ruleText}</p>
                          </div>
                        );
                      })}

                      {businessRules.length > 2 && (
                        <p className="text-xs text-gray-500">
                          + {businessRules.length - 2} more rules
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
