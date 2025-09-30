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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentContext.aggregates.map((aggregate) => (
            <Card key={aggregate.id} hover onClick={() => navigate(aggregate.id)}>
              <CardHeader className="bg-yellow-50">
                <div className="flex items-center space-x-3">
                  <Box className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{aggregate.name}</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Root Entity</p>
                    <p className="font-medium text-gray-900">{aggregate.rootEntity.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Entities</p>
                      <p className="font-semibold text-gray-900">{aggregate.entities.length + 1}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value Objects</p>
                      <p className="font-semibold text-gray-900">{aggregate.valueObjects.length}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="command">{aggregate.commands.length} Commands</Badge>
                    <Badge variant="event">{aggregate.events.length} Events</Badge>
                    <Badge variant="rule">{aggregate.businessRules.length} Rules</Badge>
                  </div>

                  {aggregate.businessRules.slice(0, 2).map((rule) => (
                    <div key={rule.id} className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm font-medium text-green-900">{rule.name}</p>
                      <p className="text-xs text-green-700 mt-1">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};