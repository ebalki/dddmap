import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Zap, Shield, Link as LinkIcon, Sparkles, FileText } from 'lucide-react';
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

  const totalCommands = currentContext.aggregates.reduce((sum, agg) => sum + (agg.commands?.length || 0), 0);
  const totalEvents = currentContext.aggregates.reduce((sum, agg) => sum + (agg.events?.length || 0), 0);

  // Extract business rules from responsibilities (RULE: prefix)
  const businessRules = currentContext.aggregates.reduce((rules, agg) => {
    const aggRules = (agg.responsibilities || []).filter(r => r.startsWith('RULE:'));
    return rules + aggRules.length;
  }, 0);

  // Get context color based on type
  const getContextColor = () => {
    switch (currentContext.type) {
      case 'FEATURE':
        return 'bg-blue-100';
      case 'APPLICATION':
        return 'bg-green-100';
      case 'SYSTEM':
        return 'bg-purple-100';
      case 'TEAM':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 ${getContextColor()} rounded-xl flex items-center justify-center`}>
              <Box className="w-8 h-8 text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{currentContext.name}</h1>
                {currentContext.type && (
                  <Badge variant="default">{currentContext.type}</Badge>
                )}
              </div>
              <p className="text-gray-600">{currentContext.domainVisionStatement || 'No description'}</p>
            </div>
          </div>

          {/* Additional metadata */}
          {(currentContext.implementationTechnology || currentContext.evolution) && (
            <div className="flex gap-4 text-sm text-gray-600">
              {currentContext.implementationTechnology && (
                <span>
                  <strong>Tech:</strong> {currentContext.implementationTechnology}
                </span>
              )}
              {currentContext.evolution && (
                <span>
                  <strong>Evolution:</strong> {currentContext.evolution}
                </span>
              )}
            </div>
          )}
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
                <p className="text-3xl font-bold text-gray-900">{businessRules}</p>
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

        {/* Responsibilities & Business Rules */}
        {currentContext.responsibilities && currentContext.responsibilities.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Responsibilities</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {currentContext.responsibilities.map((resp, idx) => {
                  const isRule = resp.startsWith('RULE:');
                  const text = isRule ? resp.substring(6).trim() : resp;

                  return (
                    <div
                      key={idx}
                      className={`border-l-4 pl-4 py-2 ${
                        isRule ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      {isRule && (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded mb-1">
                          BUSINESS RULE
                        </span>
                      )}
                      <p className="text-sm text-gray-900">{text}</p>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Aggregates Overview */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Aggregates</h2>
          </CardHeader>
          <CardBody>
            {currentContext.aggregates.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No aggregates defined</p>
            ) : (
              <div className="space-y-4">
                {currentContext.aggregates.map((aggregate) => {
                  const rootEntity = aggregate.entities.find(e => e.aggregateRoot);
                  const aggregateRules = (aggregate.responsibilities || []).filter(r => r.startsWith('RULE:')).length;

                  return (
                    <div
                      key={aggregate.name}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`aggregates/${aggregate.name}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{aggregate.name}</h3>
                          {aggregate.responsibilities && aggregate.responsibilities.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {aggregate.responsibilities.length} responsibilities
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="command">{aggregate.commands?.length || 0} Commands</Badge>
                          <Badge variant="event">{aggregate.events?.length || 0} Events</Badge>
                          <Badge variant="rule">{aggregateRules} Rules</Badge>
                        </div>
                      </div>
                      {rootEntity && (
                        <p className="text-sm text-gray-600">
                          Root Entity: <span className="font-medium">{rootEntity.name}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {aggregate.entities.length} entities, {aggregate.valueObjects.length} value objects, {aggregate.services?.length || 0} services
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
