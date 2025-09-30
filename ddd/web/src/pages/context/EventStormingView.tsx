import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const EventStormingView: React.FC = () => {
  const { currentContext } = useBoundedContext();
  const [stickies] = useState([
    { id: '1', type: 'event', content: 'Order Placed', x: 100, y: 100 },
    { id: '2', type: 'command', content: 'Place Order', x: 300, y: 100 },
    { id: '3', type: 'aggregate', content: 'Order', x: 500, y: 100 },
    { id: '4', type: 'event', content: 'Payment Processed', x: 700, y: 100 },
  ]);

  if (!currentContext) return null;

  const getStickyColor = (type: string) => {
    const colors: Record<string, string> = {
      event: 'bg-orange-200 border-orange-400',
      command: 'bg-blue-200 border-blue-400',
      aggregate: 'bg-yellow-200 border-yellow-400',
      policy: 'bg-pink-200 border-pink-400',
      hotspot: 'bg-red-200 border-red-400',
      external: 'bg-purple-200 border-purple-400',
    };
    return colors[type] || 'bg-gray-200 border-gray-400';
  };

  return (
    <div className="p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Storming Canvas</h1>
            <p className="text-gray-600">Visual domain discovery for {currentContext.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Sticky
            </Button>
          </div>
        </div>

        {/* Legend */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-medium text-gray-700">Legend:</span>
              <Badge variant="event">Domain Events</Badge>
              <Badge variant="command">Commands</Badge>
              <Badge variant="aggregate">Aggregates</Badge>
              <Badge variant="integration">Policies</Badge>
              <Badge variant="error">Hotspots</Badge>
            </div>
          </CardBody>
        </Card>

        {/* Canvas */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Canvas</h2>
          </CardHeader>
          <CardBody>
            <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[600px] overflow-hidden">
              {/* Timeline */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300"></div>
              <div className="absolute top-2 left-4 text-xs text-gray-500">Time →</div>

              {/* Sticky Notes */}
              {stickies.map((sticky) => (
                <div
                  key={sticky.id}
                  className={`absolute w-32 h-24 ${getStickyColor(sticky.type)} border-2 rounded shadow-md p-3 cursor-move hover:shadow-lg transition-shadow`}
                  style={{ left: sticky.x, top: sticky.y }}
                >
                  <p className="text-sm font-medium text-gray-900 break-words">{sticky.content}</p>
                </div>
              ))}

              {/* Help Text */}
              <div className="absolute bottom-4 left-4 text-sm text-gray-500">
                Drag sticky notes to organize your domain model timeline
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};