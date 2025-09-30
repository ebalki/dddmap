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
          <Card key={cmd.id}>
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{cmd.name}</h3>
                <Badge variant="aggregate">{aggregate.name}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Parameters</p>
                  <div className="space-y-1">
                    {cmd.parameters.map((param) => (
                      <div key={param.name} className="text-sm bg-gray-50 px-2 py-1 rounded">
                        <span className="font-mono text-gray-900">{param.name}</span>
                        <span className="text-gray-500">: {param.type}</span>
                        {param.required && <Badge className="ml-2" variant="error">required</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                {cmd.producesEvents.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Produces Events</p>
                    <div className="flex gap-2 flex-wrap">
                      {cmd.producesEvents.map((eventId) => {
                        const event = aggregate.events.find(e => e.id === eventId);
                        return event ? <Badge key={eventId} variant="event">{event.name}</Badge> : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );

  const eventsTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentContext.aggregates.map((aggregate) =>
        aggregate.events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="bg-orange-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{event.name}</h3>
                <div className="flex gap-2">
                  <Badge variant="aggregate">{aggregate.name}</Badge>
                  {event.isPublished && <Badge variant="event">Published</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Properties</p>
                  <div className="space-y-1">
                    {event.properties.map((prop) => (
                      <div key={prop.name} className="text-sm bg-gray-50 px-2 py-1 rounded">
                        <span className="font-mono text-gray-900">{prop.name}</span>
                        <span className="text-gray-500">: {prop.type}</span>
                        {prop.required && <Badge className="ml-2" variant="error">required</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                {event.isPublished && (
                  <div className="bg-purple-50 border border-purple-200 rounded p-2">
                    <p className="text-xs text-purple-900">
                      Published to other bounded contexts
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))
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