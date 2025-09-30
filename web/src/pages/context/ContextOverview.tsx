import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Zap, Shield, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const ContextOverview: React.FC = () => {
  const { currentContext } = useBoundedContext();
  const navigate = useNavigate();

  if (!currentContext) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Context Selected</h2>
          <p className="text-gray-600">Please select a bounded context to view details</p>
        </div>
      </div>
    );
  }

  const totalCommands = currentContext.aggregates.reduce((sum, agg) => sum + agg.commands.length, 0);
  const totalEvents = currentContext.aggregates.reduce((sum, agg) => sum + agg.events.length, 0);
  const totalBusinessRules = currentContext.aggregates.reduce((sum, agg) => sum + agg.businessRules.length, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 ${currentContext.color} rounded-xl flex items-center justify-center`}>
              <Box className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentContext.name}</h1>
              <p className="text-gray-600">{currentContext.description}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-center">
                <Box className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{currentContext.aggregates.length}</p>
                <p className="text-sm text-gray-600">Aggregates</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{totalCommands}</p>
                <p className="text-sm text-gray-600">Commands</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
                <p className="text-sm text-gray-600">Events</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{totalBusinessRules}</p>
                <p className="text-sm text-gray-600">Business Rules</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('aggregates')}>
                <Box className="w-4 h-4 mr-2" />
                View Aggregates
              </Button>
              <Button variant="outline" onClick={() => navigate('event-storming')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Event Storming
              </Button>
              <Button variant="outline" onClick={() => navigate('business-rules')}>
                <Shield className="w-4 h-4 mr-2" />
                Business Rules
              </Button>
              <Button variant="outline" onClick={() => navigate('integrations')}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Ubiquitous Language */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Ubiquitous Language</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentContext.ubiquitousLanguage).map(([term, definition]) => (
                <div key={term} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{term}</h3>
                  <p className="text-sm text-gray-600">{definition}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Aggregates Overview */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Aggregates</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {currentContext.aggregates.map((aggregate) => (
                <div
                  key={aggregate.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`aggregates/${aggregate.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{aggregate.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="command">{aggregate.commands.length} Commands</Badge>
                      <Badge variant="event">{aggregate.events.length} Events</Badge>
                      <Badge variant="rule">{aggregate.businessRules.length} Rules</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Root Entity: <span className="font-medium">{aggregate.rootEntity.name}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};