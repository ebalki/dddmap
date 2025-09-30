import React from 'react';
import { Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';
import { useProject } from '../../contexts/ProjectContext';

export const IntegrationsView: React.FC = () => {
  const { currentContext } = useBoundedContext();
  const { boundedContexts } = useProject();

  if (!currentContext) return null;

  const publishedIntegrations = currentContext.integrations.filter(
    i => i.sourceContextId === currentContext.id
  );
  const consumedIntegrations = currentContext.integrations.filter(
    i => i.targetContextId === currentContext.id
  );

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

        {/* Events We Publish */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Events We Publish</h2>
          {publishedIntegrations.length > 0 ? (
            <div className="space-y-4">
              {publishedIntegrations.map((integration) => {
                const targetContext = boundedContexts.find(c => c.id === integration.targetContextId);
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${currentContext.color} px-3 py-1 rounded font-medium`}>
                            {currentContext.name}
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className={`${targetContext?.color} px-3 py-1 rounded font-medium`}>
                            {targetContext?.name}
                          </div>
                        </div>
                        <Badge variant="integration">{integration.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-gray-700 mb-3">{integration.description}</p>
                      {integration.eventsPublished && integration.eventsPublished.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Published Events:</p>
                          <div className="flex gap-2 flex-wrap">
                            {integration.eventsPublished.map((event) => (
                              <Badge key={event} variant="event">{event}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
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

        {/* Events We Consume */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Events We Consume</h2>
          {consumedIntegrations.length > 0 ? (
            <div className="space-y-4">
              {consumedIntegrations.map((integration) => {
                const sourceContext = boundedContexts.find(c => c.id === integration.sourceContextId);
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${sourceContext?.color} px-3 py-1 rounded font-medium`}>
                            {sourceContext?.name}
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className={`${currentContext.color} px-3 py-1 rounded font-medium`}>
                            {currentContext.name}
                          </div>
                        </div>
                        <Badge variant="integration">{integration.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-gray-700 mb-3">{integration.description}</p>
                      {integration.eventsConsumed && integration.eventsConsumed.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Consumed Events:</p>
                          <div className="flex gap-2 flex-wrap">
                            {integration.eventsConsumed.map((event) => (
                              <Badge key={event} variant="event">{event}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
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