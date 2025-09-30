import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useProject } from '../contexts/ProjectContext';
import { mockIntegrations } from '../data/mockData';

export const ContextMap: React.FC = () => {
  const navigate = useNavigate();
  const { boundedContexts } = useProject();

  return (
    <AppShell>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Context Map</h1>
            <p className="text-gray-600">Strategic design view of bounded contexts and their relationships</p>
          </div>

          {/* Visual Context Map */}
          <Card className="mb-8">
            <CardBody className="p-8">
              <div className="relative">
                {/* Grid layout for contexts */}
                <div className="grid grid-cols-2 gap-8">
                  {boundedContexts.map((context, index) => (
                    <div
                      key={context.id}
                      className={`relative ${context.color} border-2 border-gray-300 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
                      onClick={() => navigate(`/context/${context.id}`)}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{context.name}</h3>
                      <p className="text-sm text-gray-700 mb-4">{context.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="aggregate">{context.aggregates.length} Aggregates</Badge>
                        <Badge variant="integration">{context.integrations.length} Integrations</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connection lines visualization hint */}
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                  {/* Order -> Inventory */}
                  <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
                  {/* Order -> Payment */}
                  <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
            </CardBody>
          </Card>

          {/* Integration Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Context Integrations</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockIntegrations.map((integration) => {
                const source = boundedContexts.find(c => c.id === integration.sourceContextId);
                const target = boundedContexts.find(c => c.id === integration.targetContextId);

                return (
                  <Card key={integration.id}>
                    <CardBody>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`${source?.color} px-3 py-1 rounded-md font-medium text-gray-900`}>
                            {source?.name}
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className={`${target?.color} px-3 py-1 rounded-md font-medium text-gray-900`}>
                            {target?.name}
                          </div>
                        </div>
                        <Badge variant="integration">{integration.type}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{integration.description}</p>
                      {integration.eventsPublished && integration.eventsPublished.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {integration.eventsPublished.map((event) => (
                            <Badge key={event} variant="event">{event}</Badge>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};