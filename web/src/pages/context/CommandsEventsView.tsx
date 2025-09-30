import React from 'react';
import { Zap } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const CommandsEventsView: React.FC = () => {
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  const commandsTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentContext.aggregates.map((aggregate) =>
        aggregate.commands.map((cmd) => (
          <Card key={`${aggregate.name}-${cmd.name}`}>
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{cmd.name}</h3>
                <Badge variant="aggregate">{aggregate.name}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {cmd.attributes.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Attributes</p>
                    <div className="space-y-1">
                      {cmd.attributes.map((attr) => (
                        <div key={attr.name} className="text-sm bg-gray-50 px-2 py-1 rounded">
                          <span className="font-mono text-gray-900">{attr.name}</span>
                          <span className="text-gray-500">: {attr.type}</span>
                          {attr.required && <Badge className="ml-2" variant="error">required</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cmd.references.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">References</p>
                    <div className="space-y-1">
                      {cmd.references.map((ref) => (
                        <div key={ref.name} className="text-sm bg-blue-50 px-2 py-1 rounded">
                          <span className="font-mono text-blue-900">→ {ref.name}</span>
                          <span className="text-blue-700">: {ref.domainObjectType}</span>
                          {ref.required && <Badge className="ml-2" variant="error">required</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))
      )}
      {currentContext.aggregates.every(agg => agg.commands.length === 0) && (
        <div className="col-span-2 text-center py-12 text-gray-600">
          No commands defined in this context
        </div>
      )}
    </div>
  );

  const eventsTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentContext.aggregates.map((aggregate) =>
        aggregate.events.map((event) => (
          <Card key={`${aggregate.name}-${event.name}`}>
            <CardHeader className="bg-orange-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{event.name}</h3>
                <Badge variant="aggregate">{aggregate.name}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {event.attributes.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Attributes</p>
                    <div className="space-y-1">
                      {event.attributes.map((attr) => (
                        <div key={attr.name} className="text-sm bg-gray-50 px-2 py-1 rounded">
                          <span className="font-mono text-gray-900">{attr.name}</span>
                          <span className="text-gray-500">: {attr.type}</span>
                          {attr.required && <Badge className="ml-2" variant="error">required</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {event.references.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">References</p>
                    <div className="space-y-1">
                      {event.references.map((ref) => (
                        <div key={ref.name} className="text-sm bg-orange-50 px-2 py-1 rounded">
                          <span className="font-mono text-orange-900">→ {ref.name}</span>
                          <span className="text-orange-700">: {ref.domainObjectType}</span>
                          {ref.required && <Badge className="ml-2" variant="error">required</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))
      )}
      {currentContext.aggregates.every(agg => agg.events.length === 0) && (
        <div className="col-span-2 text-center py-12 text-gray-600">
          No events defined in this context
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Commands & Events</h1>
          </div>
          <p className="text-gray-600">All commands and domain events in {currentContext.name}</p>
        </div>

        <Tabs
          tabs={[
            { id: 'commands', label: 'Commands', content: commandsTab },
            { id: 'events', label: 'Events', content: eventsTab },
          ]}
        />
      </div>
    </div>
  );
};
