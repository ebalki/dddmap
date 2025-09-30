import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const EventStormingView: React.FC = () => {
  const { currentContext } = useBoundedContext();

  const stickies = useMemo(() => {
    if (!currentContext) return [];

    const result: Array<{ id: string; type: string; content: string; x: number; y: number; aggregate?: string }> = [];
    let currentX = 100;
    let currentY = 100;
    const spacing = 200;
    const rowHeight = 150;
    let itemsInRow = 0;
    const maxItemsPerRow = 5;

    // Generate stickies for each aggregate
    currentContext.aggregates.forEach((aggregate, aggIdx) => {
      // Add aggregate sticky
      result.push({
        id: `agg-${aggIdx}`,
        type: 'aggregate',
        content: aggregate.name,
        aggregate: aggregate.name,
        x: currentX,
        y: currentY,
      });
      currentX += spacing;
      itemsInRow++;

      // Add commands for this aggregate
      aggregate.commands.forEach((cmd, cmdIdx) => {
        if (itemsInRow >= maxItemsPerRow) {
          currentX = 100;
          currentY += rowHeight;
          itemsInRow = 0;
        }
        result.push({
          id: `cmd-${aggIdx}-${cmdIdx}`,
          type: 'command',
          content: cmd.name,
          aggregate: aggregate.name,
          x: currentX,
          y: currentY,
        });
        currentX += spacing;
        itemsInRow++;
      });

      // Add events for this aggregate
      aggregate.events.forEach((event, evtIdx) => {
        if (itemsInRow >= maxItemsPerRow) {
          currentX = 100;
          currentY += rowHeight;
          itemsInRow = 0;
        }
        result.push({
          id: `evt-${aggIdx}-${evtIdx}`,
          type: 'event',
          content: event.name,
          aggregate: aggregate.name,
          x: currentX,
          y: currentY,
        });
        currentX += spacing;
        itemsInRow++;
      });

      // Move to next row after each aggregate's elements
      currentX = 100;
      currentY += rowHeight;
      itemsInRow = 0;
    });

    return result;
  }, [currentContext]);

  if (!currentContext) return null;

  const getStickyColor = (type: string) => {
    const colors: Record<string, string> = {
      event: 'bg-orange-200 border-orange-400 text-orange-900',
      command: 'bg-blue-200 border-blue-400 text-blue-900',
      aggregate: 'bg-yellow-200 border-yellow-400 text-yellow-900',
      policy: 'bg-pink-200 border-pink-400 text-pink-900',
      hotspot: 'bg-red-200 border-red-400 text-red-900',
      external: 'bg-purple-200 border-purple-400 text-purple-900',
    };
    return colors[type] || 'bg-gray-200 border-gray-400 text-gray-900';
  };

  return (
    <div className="p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Storming Canvas</h1>
            <p className="text-gray-600">Visual domain model for {currentContext.name}</p>
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
              <span className="text-sm text-gray-600 ml-4">
                Showing {stickies.filter(s => s.type === 'command').length} commands, {' '}
                {stickies.filter(s => s.type === 'event').length} events, {' '}
                {stickies.filter(s => s.type === 'aggregate').length} aggregates
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Canvas */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Canvas - Generated from CML</h2>
          </CardHeader>
          <CardBody>
            {stickies.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No commands, events, or aggregates defined in this context yet
              </div>
            ) : (
              <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-auto" style={{ minHeight: '600px' }}>
                {/* Timeline */}
                <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300"></div>
                <div className="absolute top-2 left-4 text-xs text-gray-500">Time →</div>

                {/* Sticky Notes */}
                {stickies.map((sticky) => (
                  <div
                    key={sticky.id}
                    className={`absolute w-40 h-28 ${getStickyColor(sticky.type)} border-2 rounded shadow-md p-3`}
                    style={{ left: sticky.x, top: sticky.y }}
                  >
                    <p className="text-xs font-semibold mb-1 uppercase">{sticky.type}</p>
                    <p className="text-sm font-medium break-words">{sticky.content}</p>
                    {sticky.aggregate && (
                      <p className="text-xs mt-2 opacity-75">→ {sticky.aggregate}</p>
                    )}
                  </div>
                ))}

                {/* Help Text */}
                <div className="absolute bottom-4 left-4 text-sm text-gray-500">
                  Event Storming visualization generated from CML model
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
